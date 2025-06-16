import { forwardRef, useMemo } from 'react';
import { useSelector } from '../../services/store';
import {
  selectConstructorBun,
  selectConstructorIngredients
} from '../../services/selectors/constructorSelectors';
import { BUN_MULTIPLIER } from '../../utils/constants';
import { TIngredientsCategoryProps } from './type';
import { TIngredient } from '@utils-types';
import { IngredientsCategoryUI } from '../ui/ingredients-category';

export const IngredientsCategory = forwardRef<
  HTMLUListElement,
  TIngredientsCategoryProps
>(({ title, titleRef, ingredients }, ref) => {
  const bun = useSelector(selectConstructorBun);
  const constructorIngredients = useSelector(selectConstructorIngredients);

  const ingredientsCounters = useMemo(() => {
    const counters: { [key: string]: number } = {};

    // Считаем ингредиенты в конструкторе
    if (constructorIngredients) {
      constructorIngredients.forEach((ingredient: TIngredient) => {
        if (!counters[ingredient._id]) counters[ingredient._id] = 0; // Инициализация счетчика
        counters[ingredient._id]++;
      });
    }

    // Булка считается как 2 (верх и низ)
    if (bun) counters[bun._id] = BUN_MULTIPLIER;

    return counters;
  }, [bun, constructorIngredients]);

  return (
    <IngredientsCategoryUI
      title={title}
      titleRef={titleRef}
      ingredients={ingredients}
      ingredientsCounters={ingredientsCounters}
      ref={ref}
    />
  );
});
