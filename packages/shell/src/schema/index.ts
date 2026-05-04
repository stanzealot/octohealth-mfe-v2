import * as yup from 'yup';

export const loginSchema = yup.object({
  username: yup
    .string()
    .min(3, 'Email or username must be at least 3 characters')
    .required('Email or username is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});
