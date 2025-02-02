'use client';
import Image from 'next/image';
import { useState, useEffect, FormEvent } from 'react';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks/hook';
import { ErrorInterface, ProductFields, getErrorForField } from '@/utils';
import { Button, ButtonStyle, Input } from '@/components/formElements';
import useToast from '@/components/alerts/Alerts';
import { RegistrationKeys } from '../../(Authentication)/register/page';
import CustomSelect from '../../../components/CustomSelect/CustomSelect';
import { fetchCategories } from '@/redux/slices/categoriesSlice';
import { addProduct } from '@/redux/slices/itemSlice';
import { RootState } from '@/redux/store';
import { useSelector } from 'react-redux';
import { getCategories } from '@/redux/slices/categorySlice';
import { ToastContainer } from 'react-toastify';

export interface FormDataInterface {
  price: string;
  name: string;
  quantity: string;
  description: string;
  categoryId?: string;
  expiryDate?: string;
  images?: File[];
}
export type ProductKeys = keyof FormDataInterface;
const Form = () => {
  const dispatch = useAppDispatch();
  const { status, error } = useAppSelector(state => state.product);
  const { showSuccess, showError } = useToast();
  const [files, setFiles] = useState<File[]>([]);
  const [category, setCategory] = useState<string | null>(null);
  const [expiryDate, setExpiryDate] = useState<string>('');
  const [errors, setErrors] = useState<ErrorInterface[]>([]);
  const router = useRouter();
  const InitialFormValues: FormDataInterface = {
    name: '',
    price: '',
    quantity: '',
    description: ''
  };
  const [formData, setFormData] =
    useState<FormDataInterface>(InitialFormValues);
  const { categoriesLoading, success, categoriesData } = useSelector(
    (state: RootState) => state.categories
  );
  useEffect(() => {
    if (categoriesData === null && !categoriesLoading && error === null) {
      dispatch(getCategories());
    }
  }, [dispatch, categoriesData, categoriesLoading, error]);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prevFiles => [...prevFiles, ...newFiles]);
    }
  };
  const handleRemoveImage = (index: number) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };
  const handleChange = (key: RegistrationKeys, value: string) => {
    setErrors([]);
    setFormData(prevFormData => {
      const updatedFormData = { ...prevFormData, [key]: value };
      return updatedFormData;
    });
  };
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors([]);
    const newErrors: ErrorInterface[] = [];
    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }
    const productData: FormDataInterface = {
      name: formData.name,
      price: formData.price,
      quantity: formData.quantity,
      description: formData.description,
      categoryId: category || '',
      expiryDate: expiryDate,
      images: files
    };

    await dispatch(addProduct(productData));
    if (status === 'succeeded') {
      showSuccess('product added sucessfully');
      router.push('/dashboard/products');
    } else if (status === 'failed') {
      showError('failed to add product');
    }
  };

  return (
    <div className="md:flex md:justify-around sm:justify-around sm:flex lg:justify-around lg:flex bg-[#e7f6f2] p-8 rounded-lg shadow-lg w-full ">
      <div className="mb-4 pr-2 w-[300px]">
        <div className="flex justify-center items-center border-2 border-dashed border-[#395b64] rounded-lg h-56 w-72 bg-gray-50">
          <div className="text-center text-black">
            <p>Drag and drop your files here</p>
            <p>or</p>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer bg-gray-200 px-3 py-1 rounded-md"
            >
              Browse files
            </label>
          </div>
        </div>
        <div className="mt-4 flex space-x-2 w-[100]">
          {files.map((file, idx) => (
            <div key={idx} className="relative border rounded p-1">
              <Image
                src={URL.createObjectURL(file)}
                alt={`Thumbnail ${idx}`}
                width={50}
                height={50}
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(idx)}
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
              >
                X
              </button>
            </div>
          ))}
        </div>
      </div>
      <form
        className="space-y-4 sm:w-[550px] md:w-[550px]"
        onSubmit={handleSubmit}
      >
        {ProductFields.map((field, i) => (
          <div
            className="w-full mt-2 flex flex-col gap-1 animate_animated animate_fadeInDown"
            key={i}
          >
            <Input
              label={field.label}
              placeholder={field.placeholder}
              type={field.type}
              value={formData[field.key as ProductKeys] || ''}
              onChange={(e: { target: { value: any } }) =>
                handleChange(field.key, e.target.value)
              }
              valid={getErrorForField(errors, field.key) ? false : true}
            />
            {getErrorForField(errors, field.key) && (
              <span className="text-xs text-red-600 px-2 animate_animated animate_fadeInDown">
                {getErrorForField(errors, field.key)}
              </span>
            )}
          </div>
        ))}
        {categoriesData && (
          <CustomSelect
            options={categoriesData?.map(
              (cat: { id: string; name: string }) => ({
                value: cat.id,
                label: cat.name
              })
            )}
            selected={category}
            onChange={setCategory}
          />
        )}
        <input
          type="date"
          placeholder="Expiry Date"
          value={expiryDate}
          onChange={e => setExpiryDate(e.target.value)}
          className="w-full px-4 py-2 border-b-2 border-black rounded"
        />
        <div className="sm:flex sm:justify-between md:flex md:justify-between lg:flex lg:justify-between">
          <Button
            label="Submit"
            style={ButtonStyle.DARK}
            disabled={status === 'loading'}
            loading={status === 'loading'}
          />
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Form;
