import User from '../models/User.js';
import { signToken, generateOTP } from '../utils/jwt.js';
import { sendOtpSms } from '../utils/sms.js';
import { ok, fail } from '../utils/response.js';

// ── POST /api/auth/send-otp ────────────────────────────────────────────────
export const sendOtp = async (req, res) => {
  const { phone } = req.body;

  if (!phone || !/^[6-9]\d{9}$/.test(phone)) {
    return fail(res, 'Enter a valid 10-digit Indian mobile number.');
  }

  // Check if user is temporarily blocked from requesting OTPs
  const existing = await User.findOne({ phone })
    .select('+otpAttempts +otpExpiry +otpBlockedUntil');

  if (existing?.otpBlockedUntil && existing.otpBlockedUntil > new Date()) {
    const minutesLeft = Math.ceil(
      (existing.otpBlockedUntil - new Date()) / 60000
    );
    return fail(
      res,
      `Too many attempts. Try again in ${minutesLeft} minute(s).`,
      429
    );
  }

  const otp       = generateOTP();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  // Reset attempts if last OTP has expired
  const resetAttempts =
    !existing?.otpExpiry || existing.otpExpiry < new Date();

  await User.findOneAndUpdate(
    { phone },
    {
      otp,
      otpExpiry,
      otpBlockedUntil: null,
      ...(resetAttempts
        ? { otpAttempts: 1 }
        : { $inc: { otpAttempts: 1 } }),
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  await sendOtpSms(phone, otp);

  return ok(res, {
    message: 'OTP sent successfully.',
    phone,
    // Returned ONLY in development so you can test without a real SIM
    ...(process.env.NODE_ENV === 'development' && { devOtp: otp }),
  });
};

// ── POST /api/auth/verify-otp ──────────────────────────────────────────────
export const verifyOtp = async (req, res) => {
  const { phone, otp } = req.body;

  if (!phone || !otp) return fail(res, 'Phone and OTP are required.');

  const user = await User.findOne({ phone })
    .select('+otp +otpExpiry +otpAttempts +otpBlockedUntil');

  if (!user) return fail(res, 'Phone not found. Please request an OTP first.', 404);

  // Expired?
  if (!user.otpExpiry || new Date() > user.otpExpiry) {
    return fail(res, 'OTP has expired. Please request a new one.');
  }

  // Wrong OTP? Block after 5 wrong tries
  if (user.otp !== otp) {
    if (user.otpAttempts >= 5) {
      user.otpBlockedUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 min
      await user.save();
      return fail(res, 'Too many wrong attempts. Blocked for 15 minutes.', 429);
    }
    user.otpAttempts += 1;
    await user.save();
    return fail(res, `Incorrect OTP. ${5 - user.otpAttempts} attempt(s) left.`);
  }

  // ✅ OTP correct — clear it
  user.otp             = undefined;
  user.otpExpiry       = undefined;
  user.otpAttempts     = 0;
  user.otpBlockedUntil = undefined;
  await user.save();

  const token = signToken({ userId: user._id, role: user.role });

  return ok(res, {
    token,
    isNewUser: !user.isProfileComplete,
    user: {
      id:                user._id,
      phone:             user.phone,
      name:              user.name,
      email:             user.email,
      role:              user.role,
      isProfileComplete: user.isProfileComplete,
    },
  });
};

// ── POST /api/auth/setup-profile ───────────────────────────────────────────
export const setupProfile = async (req, res) => {
  const { name, email, address } = req.body;

  if (!name?.trim() || name.trim().length < 2) {
    return fail(res, 'Full name must be at least 2 characters.');
  }

  const update = {
    name:              name.trim(),
    email:             email?.trim().toLowerCase() || '',
    isProfileComplete: true,
  };

  if (address?.line1 && address?.city && address?.pincode) {
    update.$push = {
      addresses: {
        label:     address.label || 'Home',
        line1:     address.line1.trim(),
        city:      address.city.trim(),
        state:     address.state?.trim() || '',
        pincode:   address.pincode.trim(),
        isDefault: true,
      },
    };
  }

  const user = await User.findByIdAndUpdate(req.user._id, update, {
    new: true,
    runValidators: true,
  });

  return ok(res, {
    message: 'Profile saved!',
    user: {
      id:                user._id,
      phone:             user.phone,
      name:              user.name,
      email:             user.email,
      role:              user.role,
      isProfileComplete: user.isProfileComplete,
      addresses:         user.addresses,
    },
  });
};

// ── GET /api/auth/me ───────────────────────────────────────────────────────
export const getMe = async (req, res) => ok(res, { user: req.user });