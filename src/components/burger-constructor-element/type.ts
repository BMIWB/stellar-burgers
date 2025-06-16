import { TConstructorIngredient } from '@utils-types';

export type BurgerConstructorElementProps = {
  ingredient: TConstructorIngredient;
  index: number;
  totalItems: number;
  handleMoveUp?: (index: number) => void;
  handleMoveDown?: (index: number) => void;
  handleClose?: (id: string) => void;
};
