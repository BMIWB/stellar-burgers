import { FC, memo, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import { OrderCardProps } from './type';
import { TIngredient } from '@utils-types';
import { OrderCardUI } from '../ui/order-card';
import { useSelector } from '../../services/store';
import { selectIngredients } from '@selectors';
import { MAX_VISIBLE_INGREDIENTS } from '../../utils/constants';

export const OrderCard: FC<OrderCardProps> = memo(({ order }) => {
  const location = useLocation();
  const ingredients = useSelector(selectIngredients);

  const orderInfo = useMemo(() => {
    if (!ingredients.length) {
      return null;
    }

    const ingredientsInfo = order.ingredients.reduce(
      (acc: TIngredient[], item: string) => {
        const ingredient = ingredients.find(
          (ingredient) => ingredient._id === item
        );
        if (ingredient) return [...acc, ingredient];
        return acc;
      },
      []
    );

    const total = ingredientsInfo.reduce((acc, item) => acc + item.price, 0);

    const ingredientsToShow = ingredientsInfo.slice(0, MAX_VISIBLE_INGREDIENTS);

    const remains =
      ingredientsInfo.length > MAX_VISIBLE_INGREDIENTS
        ? ingredientsInfo.length - MAX_VISIBLE_INGREDIENTS
        : 0;

    const date = new Date(order.createdAt);
    return {
      ...order,
      ingredientsInfo,
      ingredientsToShow,
      remains,
      total,
      date
    };
  }, [order, ingredients]);

  if (!orderInfo) return null;

  return (
    <OrderCardUI
      orderInfo={orderInfo}
      maxIngredients={MAX_VISIBLE_INGREDIENTS}
      locationState={{ background: location }}
    />
  );
});
