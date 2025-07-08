import { FC, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from '../../services/store';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { fetchOrderByNumber } from '../../services/slices/ordersSlice';
import {
  selectIngredients,
  selectOrders,
  selectUserOrders,
  selectCurrentOrder,
  selectOrdersLoading
} from '@selectors';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const dispatch = useDispatch();
  const ingredients = useSelector(selectIngredients);
  const orders = useSelector(selectOrders);
  const userOrders = useSelector(selectUserOrders);
  const currentOrder = useSelector(selectCurrentOrder);
  const loading = useSelector(selectOrdersLoading);

  // Находим заказ по номеру в общей ленте, заказах пользователя или текущем заказе
  const orderData = useMemo(() => {
    if (!number) return null;
    const orderNumber = parseInt(number);

    return (
      orders.find((order) => order.number === orderNumber) ||
      userOrders.find((order) => order.number === orderNumber) ||
      (currentOrder && currentOrder.number === orderNumber
        ? currentOrder
        : null)
    );
  }, [number, orders, userOrders, currentOrder]);

  // Если заказ не найден, пытаемся загрузить его по номеру
  useEffect(() => {
    if (number && !orderData && !loading) {
      dispatch(fetchOrderByNumber(parseInt(number)));
    }
  }, [number, orderData, loading, dispatch]);

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length || !orderData.ingredients)
      return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item: string) => {
        if (!acc[item]) {
          const ingredient = ingredients.find(
            (ingredient) => ingredient._id === item
          );
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo || loading) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
