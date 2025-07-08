import { FC, useState, SyntheticEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import { forgotPasswordApi } from '@api';
import { ForgotPasswordUI } from '@ui-pages';
import { useForm } from '../../hooks';

export const ForgotPassword: FC = () => {
  const { values, getFieldSetter } = useForm({
    email: ''
  });
  const [error, setError] = useState<Error | null>(null);

  const navigate = useNavigate();

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    setError(null);
    forgotPasswordApi({ email: values.email })
      .then(() => {
        localStorage.setItem('resetPassword', 'true');
        navigate('/reset-password', { replace: true });
      })
      .catch((error) => setError(error));
  };

  return (
    <ForgotPasswordUI
      errorText={error?.message}
      email={values.email}
      setEmail={getFieldSetter('email')}
      handleSubmit={handleSubmit}
    />
  );
};
