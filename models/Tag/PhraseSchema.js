const { default: mongoose } = require("mongoose");
const Schema = mongoose.Schema;

const phraseSchema = new Schema({
  text: {type:String, trim:true,required: true, index:true, unique: true},
  categories: {type:[Schema.Types.ObjectId], ref: 'tagcategories', trim:true},
  samples: {type:[String], trim:true , default:[]},
  description: {type:String, trim:true , default:""},
  userUpload: {type: Schema.Types.ObjectId, ref: 'userusers'},
  order: {type: String},
  fileId: {type: Schema.Types.ObjectId, ref: 'tagfiles'},
},
{
  timestamps: true,
});

phraseSchema.pre('execute', function(next) {
    var doc = this;
    counter.findByIdAndUpdate({_id: 'phraseId'}, {$inc: { seq: 1} },{new: true}, function(error, counter)   {
        if(error){
          console.log(error)
            return next(error);
        }
        console.log('counter: ', counter)
        if(counter === null){
          const nnn = new counter({_id:'phraseId', seq:1})
          nnn.save();
        }
        doc.order = counter.seq;
        next();
    });
});

const Phrase = mongoose.model("tagphrases", phraseSchema);
module.exports = { Phrase }
