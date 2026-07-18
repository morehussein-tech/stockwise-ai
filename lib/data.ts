export type Ingredient = {
  name: string;
  unit: string;
  opening: number;
  purchased: number;
  consumed: number;
  wasted: number;
  reorder: number;
  unitCost: number;
};

export type MenuItem = {
  name: string;
  category: string;
  sold: number;
  price: number;
  foodCost: number;
};

export const ingredients: Ingredient[] = [
  { name: "Rice", unit: "kg", opening: 45, purchased: 30, consumed: 58, wasted: 1.5, reorder: 12, unitCost: 5200 },
  { name: "Chicken", unit: "kg", opening: 28, purchased: 24, consumed: 42, wasted: 2.8, reorder: 6, unitCost: 14500 },
  { name: "Beef", unit: "kg", opening: 22, purchased: 18, consumed: 31, wasted: 1.2, reorder: 6, unitCost: 16000 },
  { name: "Cooking oil", unit: "litres", opening: 20, purchased: 10, consumed: 23, wasted: 0.4, reorder: 8, unitCost: 7800 },
  { name: "Matooke", unit: "kg", opening: 55, purchased: 40, consumed: 72, wasted: 6.5, reorder: 14, unitCost: 2600 },
  { name: "Tomatoes", unit: "kg", opening: 18, purchased: 15, consumed: 23, wasted: 3.2, reorder: 9, unitCost: 4800 },
  { name: "Onions", unit: "kg", opening: 16, purchased: 10, consumed: 18, wasted: 1.1, reorder: 5, unitCost: 4200 },
  { name: "Flour", unit: "kg", opening: 30, purchased: 20, consumed: 32, wasted: 0.8, reorder: 12, unitCost: 4400 },
];

export const menuItems: MenuItem[] = [
  { name: "Chicken Pilau", category: "Main course", sold: 96, price: 18000, foodCost: 8400 },
  { name: "Beef Matooke", category: "Main course", sold: 82, price: 16000, foodCost: 7900 },
  { name: "Chicken & Chips", category: "Fast food", sold: 74, price: 20000, foodCost: 11200 },
  { name: "Vegetable Rice", category: "Main course", sold: 61, price: 12000, foodCost: 4600 },
  { name: "Chapati & Beef", category: "Local favourite", sold: 58, price: 14000, foodCost: 6900 },
  { name: "Fresh Juice", category: "Beverage", sold: 105, price: 6000, foodCost: 2100 },
];

export const dailySales = [
  { day: "Mon", sales: 690000, cost: 335000 },
  { day: "Tue", sales: 760000, cost: 360000 },
  { day: "Wed", sales: 630000, cost: 310000 },
  { day: "Thu", sales: 830000, cost: 390000 },
  { day: "Fri", sales: 1060000, cost: 495000 },
  { day: "Sat", sales: 1450000, cost: 675000 },
  { day: "Sun", sales: 1328000, cost: 619300 },
];

export const stockRows = ingredients.map((item) => {
  const balance = item.opening + item.purchased - item.consumed - item.wasted;
  return {
    ...item,
    balance,
    status: balance <= item.reorder ? "Reorder" : balance <= item.reorder * 1.35 ? "Watch" : "Healthy",
    wastageValue: item.wasted * item.unitCost,
  };
});

export const menuRows = menuItems.map((item) => {
  const revenue = item.sold * item.price;
  const totalCost = item.sold * item.foodCost;
  const profit = revenue - totalCost;
  return {
    ...item,
    revenue,
    totalCost,
    profit,
    margin: (profit / revenue) * 100,
  };
});

export const summary = {
  revenue: menuRows.reduce((sum, item) => sum + item.revenue, 0),
  foodCost: menuRows.reduce((sum, item) => sum + item.totalCost, 0),
  profit: menuRows.reduce((sum, item) => sum + item.profit, 0),
  wastage: stockRows.reduce((sum, item) => sum + item.wastageValue, 0),
  reorderCount: stockRows.filter((item) => item.status === "Reorder").length,
};
