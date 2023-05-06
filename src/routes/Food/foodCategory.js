const { connectDB } = require("../../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {FoodCategory} = require("../../../models/Schemas");
const mongoose = require("mongoose");

connectDB();

const addFoodCategory = {
  path: "/api/addFoodCategory",
  method: "post",
  checkTokenValidation: false,
  handler: async (req, res) => {
    const { id, title, description, color } = req.body;
    try {
      const category = await FoodCategory.findOne({ title });
      if (category && !id) return res.json({ error: "این دسته قبلاً ثبت شده است." });
  
      const result = await FoodCategory.findByIdAndUpdate(mongoose.Types.ObjectId(id), {
        title, description, color
      },{upsert: true, new: true});
  
      return res.json(result);
    } catch (error) {
      return res.json({error: error});
    }
  },
};


const getFoodCategories = {
  path: "/api/getFoodCategories",
  method: "get",
  checkTokenValidation: false,
  handler: async (req, res) => {
    const categories = await FoodCategory.find();

    return res.json(categories)
  },
}

const editFoodCategory = {
  path: "/api/editFoodCategory",
  method: "put",
  checkTokenValidation: false,
  handler: async (req, res) => {
    const {id, title, description} = req.body;
    const updatedCategory = await FoodCategory.findByIdAndUpdate(id, {title, description}, {new: true});

    return res.json({updatedCategory})
  },
}

module.exports = { addFoodCategory, editFoodCategory, getFoodCategories };
