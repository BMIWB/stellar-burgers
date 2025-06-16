import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { selectUserOrders } from '../../services/selectors/ordersSelectors';
import {
  selectUser,
  selectIsAuthChecked
} from '../../services/selectors/userSelectors';
import { fetchUserOrders } from '../../services/slices/ordersSlice';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const userOrders = useSelector(selectUserOrders);
  const user = useSelector(selectUser);
  const isAuthChecked = useSelector(selectIsAuthChecked);

  useEffect(() => {
    if (isAuthChecked && user) {
      dispatch(fetchUserOrders());
    }
  }, [dispatch, isAuthChecked, user]);

  return <ProfileOrdersUI orders={userOrders} />;
};
