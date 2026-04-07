export interface User {
  id: string;
  phone: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  isProfileComplete: boolean;
  addresses?: Address[];
}

export interface Address {
  _id?: string;
  label: string;
  line1: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: User, token: string) => void;
  updateUser: (user: Partial<User>) => void;
  logout: () => void;
  initAuth: () => void;
}

// API response shapes
export interface SendOtpResponse {
  success: boolean;
  message: string;
  phone: string;
  devOtp?: string; // only in development
}

export interface VerifyOtpResponse {
  success: boolean;
  token: string;
  isNewUser: boolean;
  user: User;
}

export interface SetupProfileResponse {
  success: boolean;
  message: string;
  user: User;
}

export interface ApiError {
  success: false;
  error: string;
}