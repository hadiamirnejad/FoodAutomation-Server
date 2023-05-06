const { default: mongoose } = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = new Schema(
  {
    date: {type: Date,},
    type: {type: Number, default: 1},
    foods: {type:[Schema.Types.ObjectId], ref: 'foodfoods', trim:true},
    defaultFood: {type:Schema.Types.ObjectId, ref: 'foodfoods', trim:true},
    orders: {type:[{userId: {type:Schema.Types.ObjectId, ref: 'userusers', trim:true}, food: {type:Schema.Types.ObjectId, ref: 'foodfoods', default: null, trim:true}}], default:[], trim:true}
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("foodorders", OrderSchema);

module.exports = {Order}
