
export type TrainerStatus = "Active" | "Inactive";

export type Trainer = {
  id: string;
  name: string;
  email: string;
  phone: string;
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
  specialization: string;
  experience: string;
  password: string;
  status: TrainerStatus;
  memberLimit: string;
};

export type ApiTrainer = {
  _id: string;
  name?: string;
  email?: string;
  phone?: string;
  specialization?: string;
  experience?: number;
  status?: string;
  memberLimit?: number;
  assignedMemberCount?: number;
};

export type ApiResponse = {
  success?: boolean;
  message?: string;
  trainers?: ApiTrainer[];
  trainer?: ApiTrainer;
};
