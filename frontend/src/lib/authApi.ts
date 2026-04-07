import api from '@/lib/api';
import type {
  SendOtpResponse,
  VerifyOtpResponse,
  SetupProfileResponse,
  User,
} from '@/types/auth';

export const authApi = {
  sendOtp: async (phone: string): Promise<SendOtpResponse> => {
    const { data } = await api.post<SendOtpResponse>('/auth/send-otp', { phone });
    return data;
  },

  verifyOtp: async (phone: string, otp: string): Promise<VerifyOtpResponse> => {
    const { data } = await api.post<VerifyOtpResponse>('/auth/verify-otp', { phone, otp });
    return data;
  },

  setupProfile: async (payload: {
    name: string;
    email?: string;
    address?: {
      label?: string;
      line1: string;
      city: string;
      state: string;
      pincode: string;
    };
  }): Promise<SetupProfileResponse> => {
    const { data } = await api.post<SetupProfileResponse>('/auth/setup-profile', payload);
    return data;
  },

  getMe: async (): Promise<{ user: User }> => {
    const { data } = await api.get<{ success: boolean; user: User }>('/auth/me');
    return data;
  },
};