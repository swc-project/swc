import { withFormik } from 'formik';
import { object, boolean } from 'yup';

const test = {
  validationSchema: object({
    // working
    isAgent: boolean().required(),
  }),
  handleSubmit: () => {},
};

console.log(test);

export const DealRentModalWithFormik = withFormik({
  validationSchema: object({
    // skipped o_O
    isAgent: boolean().required(),
  }),
  handleSubmit: () => {},
})(() => <span />);
