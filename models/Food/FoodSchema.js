const { default: mongoose } = require("mongoose");
const Schema = mongoose.Schema;

const FoodSchema = new Schema(
  {
    title: {
      type: String,
      trim:true,
      default: ''
    },
    categories: {type:[Schema.Types.ObjectId], ref: 'foodcategories', trim: true }
  },
  {
    timestamps: true,
  }
);

const Food = mongoose.model("foodfoods", FoodSchema);

module.exports = {Food}
