'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { authApi } from '@/lib/authApi';
import { useAuthStore } from '@/store/authStore';

interface Props {
  phone:    string;
  devOtp?:  string;
  onNewUser: () => void;
  onReturningUser: () => void;
  onBack:   () => void;
}

export default function OtpStep({ phone, devOtp, onNewUser, onReturningUser, onBack }: Props) {
  const [digits,  setDigits]  = useState<string[]>(Array(6).fill(''));
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const [timer,   setTimer]   = useState(30);
  const [resending, setResending] = useState(false);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const { setAuth } = useAuthStore();

  // Auto-fill devOtp in development
  useEffect(() => {
    if (devOtp) {
      setDigits(devOtp.split(''));
      inputs.current[5]?.focus();
    } else {
      inputs.current[0]?.focus();
    }
  }, [devOtp]);

  // Countdown timer for resend
  useEffect(() => {
    if (timer <= 0) return;
    const id = setTimeout(() => setTimer((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [timer]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...digits];
    next[index] = value;
    setDigits(next);
    setError('');
    if (value && index < 5) inputs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setDigits(pasted.split(''));
      inputs.current[5]?.focus();
    }
  };

  const verify = useCallback(async () => {
    const otp = digits.join('');
    if (otp.length !== 6) { setError('Please enter all 6 digits.'); return; }
    setError('');
    setLoading(true);
    try {
      const data = await authApi.verifyOtp(phone, otp);
      setAuth(data.user, data.token);
      data.isNewUser ? onNewUser() : onReturningUser();
    } catch (err: any) {
      const msg = err.response?.data?.error || 'Verification failed. Try again.';
      setError(msg);
      setDigits(Array(6).fill(''));
      inputs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  }, [digits, phone, setAuth, onNewUser, onReturningUser]);

  // Auto-submit when all 6 digits are filled
  useEffect(() => {
    if (digits.every((d) => d !== '') && !loading) {
      verify();
    }
  }, [digits]); // eslint-disable-line

  const resend = async () => {
    setResending(true);
    setDigits(Array(6).fill(''));
    setError('');
    try {
      await authApi.sendOtp(phone);
      setTimer(30);
      inputs.current[0]?.focus();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Could not resend OTP.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="mb-8 space-y-1">
        <h2 className="text-[1.75rem] font-semibold tracking-tight text-stone-900">
          Enter OTP
        </h2>
        <p className="text-stone-400 text-[0.9rem]">
          Sent to{' '}
          <span className="font-semibold text-stone-600">+91 {phone}</span>
        </p>

        {devOtp && (
          <div className="mt-3 inline-flex items-center gap-2 rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-2">
            <span className="text-emerald-600 text-xs">●</span>
            <span className="text-emerald-700 text-xs font-medium">
              Dev mode — OTP auto-filled: {devOtp}
            </span>
          </div>
        )}
      </div>

      {/* 6 digit boxes */}
      <div className="flex gap-2.5 mb-6" onPaste={handlePaste}>
        {digits.map((digit, i) => (
          <input
            key={i}
            ref={(el) => { inputs.current[i] = el; }}
            type="tel"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            className={`
              w-full aspect-square text-center text-xl font-bold rounded-2xl border-2
              transition-all duration-150 focus:outline-none bg-stone-50
              ${digit
                ? 'border-amber-400 bg-amber-50 text-amber-700'
                : 'border-stone-200 text-stone-800'
              }
              focus:border-amber-400 focus:ring-4 focus:ring-amber-50
            `}
          />
        ))}
      </div>

      {error && (
        <div className="flex items-start gap-2.5 rounded-xl bg-red-50 border border-red-100 px-4 py-3 mb-5">
          <svg className="w-4 h-4 text-red-500 mt-0.5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-9h2v4H9V9zm0-2h2v2H9V7z" clipRule="evenodd"/>
          </svg>
          <p className="text-red-600 text-[0.82rem] leading-relaxed">{error}</p>
        </div>
      )}

      <button
        onClick={verify}
        disabled={loading || digits.join('').length !== 6}
        className="group w-full flex items-center justify-center gap-2.5 rounded-2xl bg-amber-500 px-6 py-4 text-white text-[0.9rem] font-semibold tracking-wide transition-all hover:bg-amber-600 active:scale-[0.98] disabled:bg-stone-100 disabled:text-stone-400 disabled:cursor-not-allowed mb-4"
      >
        {loading ? (
          <>
            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
            Verifying…
          </>
        ) : (
          <>
            Verify & Continue
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
            </svg>
          </>
        )}
      </button>

      <div className="flex items-center justify-between text-[0.82rem]">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-stone-400 hover:text-stone-600 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
          </svg>
          Change number
        </button>

        {timer > 0 ? (
          <span className="text-stone-400">
            Resend in <span className="font-semibold text-stone-600 tabular-nums">{timer}s</span>
          </span>
        ) : (
          <button
            onClick={resend}
            disabled={resending}
            className="font-semibold text-amber-600 hover:text-amber-700 disabled:opacity-50 transition-colors"
          >
            {resending ? 'Sending…' : 'Resend OTP'}
          </button>
        )}
      </div>
    </div>
  );
}