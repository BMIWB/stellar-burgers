import { FC, memo } from 'react';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({
    ingredient,
    index,
    totalItems,
    handleMoveUp,
    handleMoveDown,
    handleClose
  }) => {
    const onMoveDown = () => {
      if (handleMoveDown && index < totalItems - 1) {
        handleMoveDown(index);
      }
    };

    const onMoveUp = () => {
      if (handleMoveUp && index > 0) {
        handleMoveUp(index);
      }
    };

    const onClose = () => {
      if (handleClose) {
        handleClose(ingredient.id);
      }
    };

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={onMoveUp}
        handleMoveDown={onMoveDown}
        handleClose={onClose}
      />
    );
  }
);
