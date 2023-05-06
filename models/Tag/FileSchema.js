const { default: mongoose } = require("mongoose");
const Schema = mongoose.Schema;

const fileSchema = new Schema(
  {
    filename: {type:String, trim:true,required: true, index:true},
    count: {type:Number, default:0, trim:true, required: true},
    categories: {type:[Schema.Types.ObjectId], ref: 'tagcategories', trim:true},
    tagTemplates: {type:[{
      tagTemplate: {type:Schema.Types.ObjectId, ref: 'tagtemplates', trim:true},
      users: {type:[Schema.Types.ObjectId], ref: 'userusers', trim:true},
    }], trim:true, default: []},
    user: {type:Schema.Types.ObjectId, ref: 'userusers', trim:true},
    title: {type:String, trim:true,required: true, index:true}
  },
  {
    timestamps: true,
  }
);

const PhrasesUploadFile = mongoose.model("tagfiles", fileSchema);

module.exports = {PhrasesUploadFile}
