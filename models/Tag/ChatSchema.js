const { default: mongoose } = require("mongoose");
const Schema = mongoose.Schema;

const chatSchema = new Schema({
  roomId: {type: Schema.Types.ObjectId, ref: 'tagchatrooms', trim:true , required: true},
  message: {type: String, default: '', trim:true},
  type: {type: String, default: '', trim:true},
  replyTo: {type: Schema.Types.ObjectId, ref: 'tagchats', default: null},
  forwardFrom: {type: Schema.Types.ObjectId, ref: 'tagchats', default: null},
  user: {type: Schema.Types.ObjectId, ref: 'userusers', default: null},
  state: {type: Number, default: 0}
},
{
  timestamps: true,
});

const Chat = mongoose.model("tagchats", chatSchema);
module.exports = { Chat}