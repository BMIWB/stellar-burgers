import { TOrder, TIngredient } from '@utils-types';

export const calculateOrderTotal = (
  ingredients: { [key: string]: TIngredient & { count: number } }
): number =>
  Object.values(ingredients).reduce(
    (total, ingredient) => total + ingredient.price * ingredient.count,
    0
  );

export const groupOrderIngredients = (
  orderIngredients: string[],
  allIngredients: TIngredient[]
): { [key: string]: TIngredient & { count: number } } => {
  const ingredientsInfo: { [key: string]: TIngredient & { count: number } } = {};

  orderIngredients.forEach((ingredientId) => {
    const ingredient = allIngredients.find((ing) => ing._id === ingredientId);
    if (ingredient) {
      if (!ingredientsInfo[ingredientId]) {
        ingredientsInfo[ingredientId] = { ...ingredient, count: 0 };
      }
      ingredientsInfo[ingredientId].count++;
    }
  });

  return ingredientsInfo;
};

export const formatOrderDate = (date: Date): string => {
  const today = new Date();
  const orderDate = new Date(date);
  const diffTime = today.getTime() - orderDate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Сегодня';
  if (diffDays === 1) return 'Вчера';
  return `${diffDays} дней назад`;
};
