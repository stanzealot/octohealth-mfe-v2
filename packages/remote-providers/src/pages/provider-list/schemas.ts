import * as yup from 'yup';

export const AddProviderSchema = yup.object().shape({
  providerName: yup.string().required('Provider name is required'),
  providerCode: yup.string().required('Provider code is required'),
  cacNumber: yup.string().required('CAC number is required'),
  providerType: yup.object().shape({
    value: yup.string().required('Provider type is required'),
    label: yup.string().required(),
  }),
  network: yup.array().of(yup.string()).min(1, 'At least one network is required'),
  effectiveDate: yup.string().required('Effective date is required'),
  terminationDate: yup.string().required('Termination date is required'),
  partOf: yup.object().shape({
    value: yup.string().required('Part of is required'),
    label: yup.string().required(),
  }),
  emailList: yup
    .array()
    .of(yup.string().email('Invalid email'))
    .min(1, 'At least one email is required'),
  phoneList: yup.array().of(yup.string()).min(1, 'At least one phone number is required'),
  address1: yup.string().required('Address 1 is required'),
  country: yup.string().required('Country is required'),
  state: yup.string().required('State is required'),
  townCity: yup.string().required('Town/City is required'),
  providerOwnCode: yup.boolean().required(),
  professionalFee: yup.boolean().required(),
});

export const networkSchema = yup.object().shape({
  networkName: yup.string().required('Network name is required'),
  description: yup.string().max(200, 'Description cannot exceed 200 characters').optional(),
});

export const addTariffSchema = yup.object().shape({
  tariffType: yup.string().oneOf(['Medicine', 'Service']).required('Tariff type is required'),
  providers: yup.array().of(yup.string().required()).min(1, 'At least one provider is required'),
  network: yup.object().shape({
    value: yup.string().required('Network is required'),
    label: yup.string().required(),
  }),
  tariffName: yup.string().required('Tariff name is required'),
  tariffDiscount: yup.string().required('Tariff discount is required'),
  discountType: yup.string().oneOf(['₦', '%']).required(),
  effectiveDate: yup.string().required('Effective date is required'),
  terminationDate: yup.string().optional(),
});

export const editTariffItemSchema = yup.object().shape({
  itemCode: yup.string().required('Item code is required'),
  providerItemCode: yup.string().required("Provider's item code is required"),
  itemDescription: yup.string().required('Item description is required'),
  providerItemDescription: yup.string().required("Provider's item description is required"),
  providerAmount: yup.string().required('Provider amount is required'),
});
