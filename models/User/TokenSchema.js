const { default: mongoose } = require("mongoose");
const Schema = mongoose.Schema;

var minuteFromNow = function(){
  var timeObject = new Date();
  timeObject.setTime(timeObject.getTime() + 1000 * 28800);
  return timeObject;
};

const tokenSchema = new Schema({
  token: {type:String, trim:true , required: true},
  user: {type:Schema.Types.ObjectId, ref:'userusers', trim:true},
  expiredAt: {type: Date, default: minuteFromNow, expires: 28800}
},
{
  timestamps: true,
});


const Token = mongoose.model("usertokens", tokenSchema);

module.exports = {Token}