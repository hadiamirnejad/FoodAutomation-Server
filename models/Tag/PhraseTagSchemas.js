const { default: mongoose } = require("mongoose");
const Schema = mongoose.Schema;

const phraseTagSchema = new Schema(
  {
    phrase: {type: Schema.Types.ObjectId, ref: 'tagphrases'},
    tagTemplate: {type: Schema.Types.ObjectId, ref: 'tagtemplates'},
    fileId: {type: Schema.Types.ObjectId, ref: 'tagfiles'},
    //Status: 0=base ,1=choose by tagger , 2=tagged by tagger, 3=confused, 4=send by tagger, 5=edited by checker, 6=rejected by checker, 7=accepted by checker
    status: { type: Number, default: 0 },
    phraseTags: {type: [Object], default: []},
    userTagged: {type: Schema.Types.ObjectId, ref: 'userusers'},
    userChecked: {type: Schema.Types.ObjectId, ref: 'userusers'},
    order: {type: Number, default: 0},
    forUsers: {type: [Schema.Types.ObjectId], ref: 'userusers'}
  },
  {
    timestamps: true,
  }
);

const PhraseTag = mongoose.model("tagphrasetags", phraseTagSchema);


module.exports = { PhraseTag }
