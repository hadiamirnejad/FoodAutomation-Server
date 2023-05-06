const { default: mongoose } = require("mongoose");
const Schema = mongoose.Schema;

const CalendarSchema = new Schema(
  {
    date: {type: Date},
    holiday: {type: Boolean},
    desc: {type: Object},
    category: {type: [Number], default:[1]}
  },
  {
    timestamps: true,
  }
);

const Calendar = mongoose.model("calendarcalendars", CalendarSchema);

module.exports = {Calendar}
