const { default: mongoose } = require("mongoose");
const Schema = mongoose.Schema;

const ToDoSchema = new Schema(
  {
    data: {
      type: [Object],
      default: []
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "userusers",
    },
  },
  {
    timestamps: true,
  }
);

const ToDo = mongoose.model("tagtodos", ToDoSchema);

module.exports = {ToDo}
