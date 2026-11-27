
export type TrainerRecord = Record<string, unknown>;

export type TrainerDetailsApiResponse = {
  success?: boolean;
  message?: string;
  trainer?: TrainerRecord;
  trainerDetails?: TrainerRecord;
};

export type DetailProps = {
  label: string;
  value: unknown;
  wide?: boolean;
};
