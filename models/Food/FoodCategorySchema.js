const { default: mongoose } = require("mongoose");
const Schema = mongoose.Schema;


const foodCategorySchema = new Schema({
  title: {type:String, trim:true , required: true},
  description: {type:String, trim:true , default:""},
  color: {type:String, trim:true}
},
{
  timestamps: true,
});

const FoodCategory = mongoose.model("foodcategories", foodCategorySchema);
module.exports = {FoodCategory}