import { FC, SyntheticEvent } from 'react';
import { RegisterUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import {
  selectUser,
  selectUserError
} from '../../services/selectors/userSelectors';
import { registerUser } from '../../services/slices/userSlice';
import { useForm } from '../../hooks';

export const Register: FC = () => {
  const { values, getFieldSetter } = useForm({
    userName: '',
    email: '',
    password: ''
  });

  const dispatch = useDispatch();
  const error = useSelector(selectUserError);
  const user = useSelector(selectUser);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (values.userName && values.email && values.password) {
      dispatch(
        registerUser({
          name: values.userName,
          email: values.email,
          password: values.password
        })
      );
    }
  };

  return (
    <RegisterUI
      errorText={error || ''}
      email={values.email}
      userName={values.userName}
      password={values.password}
      setEmail={getFieldSetter('email')}
      setPassword={getFieldSetter('password')}
      setUserName={getFieldSetter('userName')}
      handleSubmit={handleSubmit}
    />
  );
};
