'use client';
import { useState } from 'react';
import { authApi } from '@/lib/authApi';

interface Props {
  onSuccess: (phone: string, devOtp?: string) => void;
}

export default function PhoneStep({ onSuccess }: Props) {
  const [phone,   setPhone]   = useState('');
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!/^[6-9]\d{9}$/.test(phone)) {
      setError('Enter a valid 10-digit mobile number.');
      return;
    }
    setLoading(true);
    try {
      const data = await authApi.sendOtp(phone);
      onSuccess(phone, data.devOtp);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Could not send OTP. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="mb-8 space-y-1">
        <h2 className="text-[1.75rem] font-semibold tracking-tight text-stone-900">
          Welcome back
        </h2>
        <p className="text-stone-400 text-[0.9rem]">
          Enter your mobile number to continue
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1.5">
          <label className="text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-stone-400">
            Mobile Number
          </label>
          <div className="flex overflow-hidden rounded-2xl border border-stone-200 bg-stone-50 focus-within:border-amber-400 focus-within:ring-4 focus-within:ring-amber-50 transition-all">
            <span className="flex items-center justify-center px-4 text-stone-500 text-sm font-semibold border-r border-stone-200 bg-white min-w-[4rem]">
              +91
            </span>
            <input
              type="tel"
              inputMode="numeric"
              maxLength={10}
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
              placeholder="98765 43210"
              className="flex-1 bg-transparent px-4 py-4 text-stone-800 text-lg tracking-widest placeholder:text-stone-300 placeholder:tracking-normal placeholder:text-base focus:outline-none"
              autoFocus
            />
          </div>
        </div>

        {error && (
          <div className="flex items-start gap-2.5 rounded-xl bg-red-50 border border-red-100 px-4 py-3">
            <svg className="w-4 h-4 text-red-500 mt-0.5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-9h2v4H9V9zm0-2h2v2H9V7z" clipRule="evenodd"/>
            </svg>
            <p className="text-red-600 text-[0.82rem] leading-relaxed">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || phone.length !== 10}
          className="group w-full flex items-center justify-center gap-2.5 rounded-2xl bg-amber-500 px-6 py-4 text-white text-[0.9rem] font-semibold tracking-wide transition-all hover:bg-amber-600 active:scale-[0.98] disabled:bg-stone-100 disabled:text-stone-400 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
              Sending OTP…
            </>
          ) : (
            <>
              Get OTP
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
              </svg>
            </>
          )}
        </button>
      </form>
    </div>
  );
}