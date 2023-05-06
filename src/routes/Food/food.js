const { connectDB } = require("../../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {User, Food, Order} = require("../../../models/Schemas");
const mongoose = require("mongoose");

connectDB();

const addFood = {
  path: "/api/addFood",
  method: "post",
  checkTokenValidation: true,
  handler: async (req, res) => {
    const { id, title, categories } = req.body;
    console.log( id, title, categories)
    try{
      const food = await Food.findByIdAndUpdate(mongoose.Types.ObjectId(id),{title: title, categories: categories},{upsert: true, new: true})

      res.status(200).json(food);
    } catch(error) {
      console.log(error)
      res.json({ error: error });
    }
  },
};

const getFoods = {
  path: "/api/getFoods",
  method: "get",
  checkTokenValidation: true,
  handler: async (req, res) => {
    try{
      const foods = await Food.find().populate({path:'categories',select: {'_id':1,'title':1, 'color': 1}})

      res.status(200).json(foods);
    } catch(error) {
      res.json({ error: error });
    }
  },
};

module.exports = { addFood, getFoods };
