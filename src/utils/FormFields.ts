import { RegistrationKeys } from '@/app/(Authentication)/register/page';

interface RegistrationField {
  label: string;
  placeholder: string;
  type: React.HTMLInputTypeAttribute;
  key: RegistrationKeys;
  message: string;
}

interface ReasonField {
  placeholder: string;
  type: React.HTMLInputTypeAttribute;
  message: string;
}

interface ProductField {
  label: string;
  placeholder: string;
  type: React.HTMLInputTypeAttribute;
  key: any;
  message: string;
}

export const RegistrationFields: RegistrationField[] = [
  {
    key: 'name',
    label: 'Full Name',
    placeholder: 'Full name',
    type: 'text',
    message: 'Please provide a valid name!'
  },
  {
    key: 'phone',
    label: 'Phone Number',
    placeholder: 'Phone Number',
    type: 'text',
    message: 'Please provide a valid phone number start with 078/079/072/073'
  },
  {
    key: 'email',
    label: 'Email',
    placeholder: 'Email',
    type: 'text',
    message: 'Please provide a valid email, Eg: test@gmail.com!'
  },
  {
    key: 'address',
    label: 'Address',
    placeholder: 'Address',
    type: 'text',
    message: 'Please provide a valid address!'
  },
  {
    key: 'password',
    label: 'Password',
    placeholder: 'Password',
    type: 'password',
    message: 'Please provide a valid password'
  }
];

export const ReasonFields: ReasonField[] = [
  {
    placeholder: 'Type here reasons',
    type: 'text',
    message: 'Provide valid reasons'
  }
];
export const ProductFields: ProductField[] = [
  {
    key: 'name',
    label: 'Product Name',
    placeholder: 'Product name',
    type: 'text',
    message: 'Please provide a valid name!'
  },
  {
    key: 'price',
    label: 'Price',
    placeholder: 'Price',
    type: 'text',
    message: 'Please provide a valid price'
  },
  {
    key: 'quantity',
    label: 'Quantity',
    placeholder: 'Quantity',
    type: 'text',
    message: 'Please provide a valid quantity'
  },
  {
    key: 'description',
    label: 'description',
    placeholder: 'description',
    type: 'text',
    message: 'Please provide a description!'
  }
];
