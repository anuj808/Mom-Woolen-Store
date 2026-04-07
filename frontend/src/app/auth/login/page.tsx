'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import PhoneStep        from '@/components/auth/PhoneStep';
import OtpStep          from '@/components/auth/OtpStep';
import ProfileSetupStep from '@/components/auth/ProfileSetupStep';

type Step = 'phone' | 'otp' | 'profile';

const STEP_META: Record<Step, { index: number; label: string }> = {
  phone:   { index: 0, label: 'Mobile'  },
  otp:     { index: 1, label: 'Verify'  },
  profile: { index: 2, label: 'Profile' },
};

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthStore();

  const [step,   setStep]   = useState<Step>('phone');
  const [phone,  setPhone]  = useState('');
  const [devOtp, setDevOtp] = useState<string | undefined>();

  // Redirect already-logged-in users away from this page
  useEffect(() => {
    if (!isLoading && isAuthenticated) router.replace('/');
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <svg className="animate-spin w-6 h-6 text-amber-400" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
        </svg>
      </div>
    );
  }

  const currentIndex = STEP_META[step].index;

  return (
    <main className="min-h-screen bg-stone-50 flex items-center justify-center p-4">

      {/* Subtle background blobs */}
      <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-amber-100 opacity-50 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-orange-100 opacity-40 blur-3xl" />
      </div>

      <div className="relative w-full max-w-[22rem]">

        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center shadow-md shadow-amber-200">
              {/* Wool ball icon */}
              <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="12" cy="12" r="9"/>
                <path strokeLinecap="round" d="M3.5 9.5C7 8 12 10 15 8s3-5 0-5"/>
                <path strokeLinecap="round" d="M20.5 14.5C17 16 12 14 9 16s-3 5 0 5"/>
                <path strokeLinecap="round" d="M9 3.8C9.5 7 12 9 12 12s-2.5 5-3 8.2"/>
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold text-stone-800 tracking-tight leading-none">
                WoolenStore
              </h1>
              <p className="text-[0.65rem] text-stone-400 tracking-[0.15em] uppercase mt-0.5">
                Handcrafted with love
              </p>
            </div>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-sm shadow-stone-200 border border-stone-100 p-7">

          {/* Step progress indicator */}
          <div className="flex items-center gap-1.5 mb-8">
            {(['phone', 'otp', 'profile'] as Step[]).map((s, i) => (
              <div key={s} className="flex items-center gap-1.5 flex-1">
                <div className="flex items-center gap-1.5 w-full">
                  {/* Dot or check */}
                  <div className={`
                    flex items-center justify-center rounded-full shrink-0 transition-all duration-300
                    ${i < currentIndex
                      ? 'w-5 h-5 bg-amber-500'
                      : i === currentIndex
                      ? 'w-5 h-5 bg-amber-500 ring-4 ring-amber-100'
                      : 'w-3 h-3 bg-stone-200'
                    }
                  `}>
                    {i < currentIndex && (
                      <svg className="w-3 h-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                    )}
                  </div>
                  {/* Connector line between steps */}
                  {i < 2 && (
                    <div className={`h-px flex-1 transition-all duration-500 ${i < currentIndex ? 'bg-amber-400' : 'bg-stone-100'}`} />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Step label */}
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.15em] text-amber-500 mb-1">
            Step {currentIndex + 1} of 3 — {STEP_META[step].label}
          </p>

          {/* Steps */}
          {step === 'phone' && (
            <PhoneStep
              onSuccess={(ph, otp) => {
                setPhone(ph);
                setDevOtp(otp);
                setStep('otp');
              }}
            />
          )}

          {step === 'otp' && (
            <OtpStep
              phone={phone}
              devOtp={devOtp}
              onNewUser={() => setStep('profile')}
              onReturningUser={() => router.replace('/')}
              onBack={() => setStep('phone')}
            />
          )}

          {step === 'profile' && (
            <ProfileSetupStep
              onComplete={() => router.replace('/')}
            />
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-[0.72rem] text-stone-400 mt-5 leading-relaxed">
          By continuing, you agree to our{' '}
          <a href="/terms" className="underline underline-offset-2 hover:text-stone-600 transition-colors">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="/privacy" className="underline underline-offset-2 hover:text-stone-600 transition-colors">
            Privacy Policy
          </a>
        </p>
      </div>
    </main>
  );
}