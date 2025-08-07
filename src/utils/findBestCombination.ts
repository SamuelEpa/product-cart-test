import { Product } from "@/types/productsType";

const findBestCombination = (items: Product[], maxBudget: number) => {
  let best: Product[] = [];
  let bestSum = 0;
  const n = items.length;
  for (let mask = 0; mask < 1 << n; mask++) {
    let combo: Product[] = [];
    let sum = 0;
    for (let i = 0; i < n; i++) {
      if (mask & (1 << i)) {
        sum += items[i].price;
        combo.push(items[i]);
      }
    }
    if (sum <= maxBudget && sum > bestSum) {
      bestSum = sum;
      best = combo;
    }
  }
  return best;
};

export default findBestCombination;