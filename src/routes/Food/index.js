const food = require("./food");
const foodCategory= require("./foodCategory");
const orders = require("./orders");

module.exports = {
  addFoodCategory: foodCategory.addFoodCategory,
  editFoodCategory: foodCategory.editFoodCategory,
  getFoodCategories: foodCategory.getFoodCategories,
  addFood: food.addFood,
  getFoods: food.getFoods,
  addOrder: orders.addOrder,
  getOrders: orders.getOrders,
  setOrder: orders.setOrder,
  getOrderStat: orders.getOrderStat,
  getOrderStatForPrint: orders.getOrderStatForPrint,
};
