import { RegistrationKeys } from '@/app/(Authentication)/register/page';
import { ResetPasswordKeys } from '@/app/(Authentication)/reset-password/page';

export interface FormErrorInterface {
  status: 'Success!' | 'Error';
  message: string;
  data: { field: string; message: string }[];
}

export interface ErrorInterface {
  message?: string;
  target: RegistrationKeys;
  msg: string;
}
export interface ResetpasswordErrorInterface {
  target: ResetPasswordKeys;
  msg: string;
}

export const getErrorForField = (errors: ErrorInterface[], key: string) => {
  const error = errors.find(error => error.target === key);
  return error ? error.msg : null;
};
