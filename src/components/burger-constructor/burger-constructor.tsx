import { FC } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { useNavigate } from 'react-router-dom';
import {
  createOrder,
  clearCurrentOrder
} from '../../services/slices/ordersSlice';
import {
  clearConstructor,
  removeIngredient,
  moveIngredient
} from '../../services/slices/constructorSlice';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import {
  selectConstructorItems,
  selectConstructorTotalPrice
} from '../../services/selectors/constructorSelectors';
import {
  selectCurrentOrder,
  selectOrdersLoading
} from '../../services/selectors/ordersSelectors';
import { selectUser } from '../../services/selectors/userSelectors';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const constructorItems = useSelector(selectConstructorItems);
  const price = useSelector(selectConstructorTotalPrice);
  const currentOrder = useSelector(selectCurrentOrder);
  const orderRequest = useSelector(selectOrdersLoading);
  const user = useSelector(selectUser);

  const orderModalData = currentOrder;

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;

    // Если пользователь не авторизован, перенаправляем на страницу входа
    if (!user) {
      navigate('/login');
      return;
    }

    const ingredientIds = [
      constructorItems.bun._id,
      ...(constructorItems.ingredients || []).map(
        (ingredient) => ingredient._id
      ),
      constructorItems.bun._id
    ];

    dispatch(createOrder(ingredientIds)).then(() => {
      dispatch(clearConstructor());
    });
  };

  const closeOrderModal = () => {
    dispatch(clearCurrentOrder());
  };

  const handleRemoveIngredient = (id: string) => {
    dispatch(removeIngredient(id));
  };

  const handleMoveUp = (index: number) => {
    if (index > 0) {
      dispatch(moveIngredient({ from: index, to: index - 1 }));
    }
  };

  const handleMoveDown = (index: number) => {
    if (
      constructorItems.ingredients &&
      index < constructorItems.ingredients.length - 1
    ) {
      dispatch(moveIngredient({ from: index, to: index + 1 }));
    }
  };

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
      handleMoveUp={handleMoveUp}
      handleMoveDown={handleMoveDown}
      handleClose={handleRemoveIngredient}
    />
  );
};
