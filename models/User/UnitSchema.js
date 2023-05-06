const { default: mongoose } = require("mongoose");
const Schema = mongoose.Schema;


const unitSchema = new Schema({
  title: {type:String, trim:true , required: true},
  description: {type:String, trim:true , default:""}
},
{
  timestamps: true,
});

const Unit = mongoose.model("userunits", unitSchema);
module.exports = {Unit}