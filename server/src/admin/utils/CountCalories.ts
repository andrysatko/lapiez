export function calculateCalories(protein:number, carbohydrates:number, fats:number) {
    const proteinCalories = protein * 4;
    const carbCalories = carbohydrates * 4;
    const fatCalories = fats * 9;
    const totalCalories = proteinCalories + carbCalories + fatCalories;
    return Math.ceil(totalCalories / 1000);
}