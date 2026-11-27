
export type TrainerStatus = "Active" | "Inactive";

export type TrainerAddress = {
  street: string;
  city: string;
  country: string;
};

export type Trainer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  photo: string;
  gender: string;
  dateOfBirth: string;
  address: TrainerAddress;
  specialization: string;
  experience: number;
  status: TrainerStatus;
  memberLimit: number;
  assignedMemberCount: number;
};

export type TrainerForm = {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  gender: string;
  dateOfBirth: string;

  // Address fields
  street: string;
  city: string;
  country: string;

  // Trainer-specific fields
  specialization: string;
  experience: string;
  status: TrainerStatus;
  memberLimit: string;
};

export type ApiTrainer = {
  _id: string;
  name?: string;
  email?: string;
  phone?: string;
  photo?: string;
  gender?: string;
  dateOfBirth?: string | null;
  address?: Partial<TrainerAddress>;
  specialization?: string;
  experience?: number | string;
  status?: string;
  memberLimit?: number;
  assignedMemberCount?: number;
  isFull?: boolean;
};

export type ApiResponse = {
  success?: boolean;
  message?: string;
  trainers?: ApiTrainer[];
  trainer?: ApiTrainer;
};
