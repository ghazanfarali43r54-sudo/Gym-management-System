import axiosClient from "@/lib/axios";

// Login request ka data
export type LoginCredentials = {
  email: string;
  password: string;
};

// Backend se expected login response
export type LoginResponse = {
  token?: string;
  user?: {
    id?: string;
    name?: string;
    email?: string;
    role?: string;
    photo?: string;
  };
  message?: string;
  redirectTo?: string;
};

// Login API function
export async function loginUser(
  credentials: LoginCredentials
) {
  const response = await axiosClient.post<LoginResponse>(
    "/api/auth/login",
    credentials,
    {
      // Login ke 401 response par global interceptor
      // session clear ya redirect nahi karega.
      validateStatus: () => true,
    }
  );

  return {
    ok: response.status >= 200 && response.status < 300,
    status: response.status,
    data: response.data,
  };
}
