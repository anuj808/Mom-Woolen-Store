'use client';
import { useState } from 'react';
import { authApi } from '@/lib/authApi';
import { useAuthStore } from '@/store/authStore';

interface Props {
  onComplete: () => void;
}

interface FormData {
  name:    string;
  email:   string;
  line1:   string;
  city:    string;
  state:   string;
  pincode: string;
}

interface FormErrors {
  name?:    string;
  email?:   string;
  pincode?: string;
  general?: string;
}

const INDIAN_STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh',
  'Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka',
  'Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram',
  'Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana',
  'Tripura','Uttar Pradesh','Uttarakhand','West Bengal',
  'Delhi','Jammu & Kashmir','Ladakh','Chandigarh','Puducherry',
];

export default function ProfileSetupStep({ onComplete }: Props) {
  const { updateUser } = useAuthStore();
  const [form, setForm] = useState<FormData>({
    name: '', email: '', line1: '', city: '', state: '', pincode: '',
  });
  const [errors,  setErrors]  = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [skipAddress, setSkipAddress] = useState(false);

  const set = (field: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setForm((f) => ({ ...f, [field]: e.target.value }));
      setErrors((er) => ({ ...er, [field]: undefined, general: undefined }));
    };

  const validate = (): boolean => {
    const errs: FormErrors = {};
    if (!form.name.trim() || form.name.trim().length < 2)
      errs.name = 'Name must be at least 2 characters.';
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = 'Enter a valid email address.';
    if (!skipAddress && form.pincode && !/^\d{6}$/.test(form.pincode))
      errs.pincode = 'Pincode must be exactly 6 digits.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const payload: Parameters<typeof authApi.setupProfile>[0] = {
        name:  form.name.trim(),
        email: form.email.trim() || undefined,
      };
      if (!skipAddress && form.line1 && form.city && form.pincode) {
        payload.address = {
          line1:   form.line1.trim(),
          city:    form.city.trim(),
          state:   form.state,
          pincode: form.pincode.trim(),
        };
      }
      const data = await authApi.setupProfile(payload);
      updateUser(data.user);
      onComplete();
    } catch (err: any) {
      setErrors({ general: err.response?.data?.error || 'Could not save profile. Try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="mb-7 space-y-1">
        <h2 className="text-[1.75rem] font-semibold tracking-tight text-stone-900">
          Set up your profile
        </h2>
        <p className="text-stone-400 text-[0.9rem]">
          Just a few details to get started
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Name */}
        <Field
          label="Full Name *"
          error={errors.name}
        >
          <input
            type="text"
            value={form.name}
            onChange={set('name')}
            placeholder="Priya Sharma"
            autoFocus
            className={inputCls(!!errors.name)}
          />
        </Field>

        {/* Email */}
        <Field label="Email Address" hint="Optional" error={errors.email}>
          <input
            type="email"
            value={form.email}
            onChange={set('email')}
            placeholder="priya@example.com"
            className={inputCls(!!errors.email)}
          />
        </Field>

        {/* Address toggle */}
        <div className="pt-1">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-stone-400">
              Delivery Address
            </span>
            <button
              type="button"
              onClick={() => setSkipAddress((s) => !s)}
              className="text-[0.75rem] text-amber-600 hover:text-amber-700 font-medium transition-colors"
            >
              {skipAddress ? '+ Add address' : 'Skip for now'}
            </button>
          </div>

          {!skipAddress && (
            <div className="rounded-2xl border border-stone-100 bg-stone-50 p-4 space-y-3">
              <Field label="Street / Area" error={undefined}>
                <input
                  type="text"
                  value={form.line1}
                  onChange={set('line1')}
                  placeholder="123, Model Town, Near Clock Tower"
                  className={inputCls(false)}
                />
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label="City" error={undefined}>
                  <input
                    type="text"
                    value={form.city}
                    onChange={set('city')}
                    placeholder="Mathura"
                    className={inputCls(false)}
                  />
                </Field>
                <Field label="Pincode" error={errors.pincode}>
                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={6}
                    value={form.pincode}
                    onChange={(e) => {
                      setForm((f) => ({ ...f, pincode: e.target.value.replace(/\D/g, '') }));
                      setErrors((er) => ({ ...er, pincode: undefined }));
                    }}
                    placeholder="281001"
                    className={inputCls(!!errors.pincode)}
                  />
                </Field>
              </div>

              <Field label="State" error={undefined}>
                <select
                  value={form.state}
                  onChange={set('state')}
                  className={inputCls(false) + ' cursor-pointer'}
                >
                  <option value="">Select state…</option>
                  {INDIAN_STATES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </Field>
            </div>
          )}
        </div>

        {errors.general && (
          <div className="flex items-start gap-2.5 rounded-xl bg-red-50 border border-red-100 px-4 py-3">
            <svg className="w-4 h-4 text-red-500 mt-0.5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-9h2v4H9V9zm0-2h2v2H9V7z" clipRule="evenodd"/>
            </svg>
            <p className="text-red-600 text-[0.82rem] leading-relaxed">{errors.general}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="group w-full flex items-center justify-center gap-2.5 rounded-2xl bg-amber-500 px-6 py-4 text-white text-[0.9rem] font-semibold tracking-wide transition-all hover:bg-amber-600 active:scale-[0.98] disabled:bg-stone-100 disabled:text-stone-400 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
              Saving profile…
            </>
          ) : (
            <>
              Save & Start Shopping
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

// ── Small helpers ──────────────────────────────────────────────────────────
const inputCls = (hasError: boolean) =>
  `w-full rounded-xl border bg-white px-4 py-3 text-[0.9rem] text-stone-800 placeholder:text-stone-300 focus:outline-none transition-all
  ${hasError
    ? 'border-red-300 focus:border-red-400 focus:ring-4 focus:ring-red-50'
    : 'border-stone-200 focus:border-amber-400 focus:ring-4 focus:ring-amber-50'}`;

function Field({
  label, hint, error, children,
}: {
  label: string;
  hint?: string;
  error: string | undefined;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-stone-400">
          {label}
        </label>
        {hint && (
          <span className="text-[0.7rem] text-stone-300 normal-case tracking-normal">{hint}</span>
        )}
      </div>
      {children}
      {error && <p className="text-[0.75rem] text-red-500 pl-1">{error}</p>}
    </div>
  );
}