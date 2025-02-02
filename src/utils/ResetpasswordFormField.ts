import { ResetPasswordKeys } from '../app/(Authentication)/reset-password/page';

interface ResetpasswordField {
  label: string;
  placeholder: string;
  type: React.HTMLInputTypeAttribute;
  key: ResetPasswordKeys;
  message: string;
}

export const ResetpasswordField: ResetpasswordField[] = [
  {
    key: 'password',
    label: 'Password',
    placeholder: 'newPassword',
    type: 'Password',
    message: 'Please provide a valid password'
  },
  {
    key: 'confirmPassword',
    label: 'confirmPassword',
    placeholder: 'confirmPassword',
    type: 'Password',
    message: 'Please provide a valid password'
  }
];
