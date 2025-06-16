import { FC, SyntheticEvent } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import {
  selectUser,
  selectUserError
} from '../../services/selectors/userSelectors';
import { loginUser } from '../../services/slices/userSlice';
import { useForm } from '../../hooks';

export const Login: FC = () => {
  const { values, getFieldSetter } = useForm({
    email: '',
    password: ''
  });

  const dispatch = useDispatch();
  const error = useSelector(selectUserError);
  const user = useSelector(selectUser);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (values.email && values.password) {
      dispatch(loginUser({ email: values.email, password: values.password }));
    }
  };

  return (
    <LoginUI
      errorText={error || ''}
      email={values.email}
      setEmail={getFieldSetter('email')}
      password={values.password}
      setPassword={getFieldSetter('password')}
      handleSubmit={handleSubmit}
    />
  );
};
