const { default: mongoose } = require("mongoose");
const Schema = mongoose.Schema;


const tagCategorySchema = new Schema({
  title: {type:String, trim:true , required: true},
  description: {type:String, trim:true , default:""},
  color: {type:String, trim:true}
},
{
  timestamps: true,
});

const TagCategory = mongoose.model("tagcategories", tagCategorySchema);
module.exports = {TagCategory}