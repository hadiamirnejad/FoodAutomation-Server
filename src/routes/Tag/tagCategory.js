const { connectDB } = require("../../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {TagCategory} = require("../../../models/Schemas");
const mongoose = require("mongoose");

connectDB();

const addCategory = {
  path: "/api/addCategory",
  method: "post",
  checkTokenValidation: false,
  handler: async (req, res) => {
    const { title, description } = req.body;
    const category = await TagCategory.findOne({ title });
    if (category) return res.json({ error: "این دسته قبلاً ثبت شده است." });

    const result = await TagCategory.create({
      title,description
    });

    return res.json(result);
  },
};


const getCategories = {
  path: "/api/getCategories",
  method: "get",
  checkTokenValidation: false,
  handler: async (req, res) => {
    const categories = await TagCategory.find();

    return res.json(categories)
  },
}

const editCategory = {
  path: "/api/editCategory",
  method: "put",
  checkTokenValidation: false,
  handler: async (req, res) => {
    const {id, title, description} = req.body;
    const updatedCategory = await TagCategory.findByIdAndUpdate(id, {title, description}, {new: true});

    return res.json({updatedCategory})
  },
}

module.exports = { addCategory, editCategory, getCategories };
