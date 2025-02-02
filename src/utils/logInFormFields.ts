import { logInKeys } from '@/app/(Authentication)/login/page';

interface logInField {
  label: string;
  placeholder: string;
  type: React.HTMLInputTypeAttribute;
  key: logInKeys;
  message: string;
}

export const logInFields: logInField[] = [
  {
    key: 'email',
    label: 'Email',
    placeholder: 'Email',
    type: 'text',
    message: 'Please provide a valid email, Eg: test@gmail.com!'
  },
  {
    key: 'password',
    label: 'Password',
    placeholder: 'Password',
    type: 'password',
    message: 'Please provide a valid password'
  }
];
