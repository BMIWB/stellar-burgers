import { Navigate, useLocation } from 'react-router-dom';
import { ReactElement } from 'react';
import { useSelector } from '../../services/store';
import {
  selectIsAuthChecked,
  selectUser
} from '../../services/selectors/userSelectors';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  component: ReactElement;
};

const ProtectedRoute = ({
  onlyUnAuth = false,
  component
}: ProtectedRouteProps): ReactElement => {
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const user = useSelector(selectUser);
  const location = useLocation();

  if (!isAuthChecked) {
    // Показываем прелоадер, пока идёт проверка авторизации
    return <div>Loading...</div>;
  }

  if (onlyUnAuth && user) {
    // Если роут только для неавторизованных, а пользователь авторизован,
    // то перенаправляем его на главную страницу или на тот адрес, что записан в location.state.from
    const { from } = location.state || { from: { pathname: '/' } };
    return <Navigate to={from} />;
  }

  if (!onlyUnAuth && !user) {
    // Если роут для авторизованных, а пользователь не авторизован,
    // то перенаправляем его на логин с указанием, куда он хотел попасть
    return <Navigate to='/login' state={{ from: location }} />;
  }

  // Если всё ок, то рендерим запрошенный компонент
  return component;
};

export const OnlyAuth = ProtectedRoute;
export const OnlyUnAuth = ({ component }: { component: ReactElement }) => (
  <ProtectedRoute onlyUnAuth component={component} />
);
