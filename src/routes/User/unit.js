const { connectDB } = require("../../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {User, Unit} = require("../../../models/Schemas");
const mongoose = require("mongoose");

connectDB();

const addOrEditUnits = {
  path: "/api/addOrEditUnits",
  method: "post",
  checkTokenValidation: false,
  handler: async (req, res) => {
    const { user, data } = req.body;
    try{
      const toDo = await ToDo.findOneAndUpdate({user: mongoose.Types.ObjectId(user)},{user: mongoose.Types.ObjectId(user), data: data}, {upsert: true,new: true})

      res.status(200).json(toDo);
    } catch {
      res.json({ error: "usernam_or_password_is_incorrect" });
    }
  },
};

const getUnits = {
  path: "/api/getUnits",
  method: "get",
  checkTokenValidation: false,
  handler: async (req, res) => {
    try{
      const units = await Unit.find({})

      res.status(200).json(units);
    } catch {
      res.json({ error: "usernam_or_password_is_incorrect" });
    }
  },
};

module.exports = { addOrEditUnits, getUnits };
