import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
  label:     { type: String, default: 'Home' },
  line1:     String,
  city:      String,
  state:     String,
  pincode:   String,
  isDefault: { type: Boolean, default: false },
});

const userSchema = new mongoose.Schema(
  {
    phone:             { type: String, required: true, unique: true, trim: true },
    name:              { type: String, trim: true, default: '' },
    email:             { type: String, trim: true, lowercase: true, default: '' },
    role:              { type: String, enum: ['customer', 'admin'], default: 'customer' },
    addresses:         [addressSchema],
    isProfileComplete: { type: Boolean, default: false },
    isActive:          { type: Boolean, default: true },
    otp:               { type: String, select: false },
    otpExpiry:         { type: Date, select: false },
    otpAttempts:       { type: Number, default: 0, select: false },
    otpBlockedUntil:   { type: Date, select: false },
  },
  { timestamps: true }
);

export default mongoose.models?.User || mongoose.model('User', userSchema);