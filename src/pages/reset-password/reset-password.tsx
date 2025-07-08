import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { resetPasswordApi } from '@api';
import { ResetPasswordUI } from '@ui-pages';
import { useForm } from '../../hooks';

export const ResetPassword: FC = () => {
  const navigate = useNavigate();
  const { values, getFieldSetter } = useForm({
    password: '',
    token: ''
  });
  const [error, setError] = useState<Error | null>(null);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    setError(null);
    resetPasswordApi({ password: values.password, token: values.token })
      .then(() => {
        localStorage.removeItem('resetPassword');
        navigate('/login');
      })
      .catch((error) => setError(error));
  };

  useEffect(() => {
    if (!localStorage.getItem('resetPassword')) {
      navigate('/forgot-password', { replace: true });
    }
  }, [navigate]);

  return (
    <ResetPasswordUI
      errorText={error?.message}
      password={values.password}
      token={values.token}
      setPassword={getFieldSetter('password')}
      setToken={getFieldSetter('token')}
      handleSubmit={handleSubmit}
    />
  );
};
