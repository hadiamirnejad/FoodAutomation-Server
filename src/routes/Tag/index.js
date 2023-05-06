const phrase = require("./phrase");
const tagCategory= require("./tagCategory");
const field = require("./field");
const toDo = require("./toDo");
const tagTemplate = require("./tagTemplate");
const chat = require("./chat");

module.exports = {
  addCategory: tagCategory.addCategory,
  editCategory: tagCategory.editCategory,
  getCategories: tagCategory.getCategories,
  addField: field.addField,
  getFields: field.getFields,
  editField: field.editField,
  addTagTemplate: tagTemplate.addTagTemplate,
  getTagTemplate: tagTemplate.getTagTemplate,
  editTagTemplate: tagTemplate.editTagTemplate,
  addPhrase: phrase.addPhrase,
  getPhrases: phrase.getPhrases,
  deletePhrases: phrase.deletePhrases,
  editPhrase: phrase.editPhrase,
  sendPhrasesTagForCkecker: phrase.sendPhrasesTagForCkecker,
  submitPhrasesTag: phrase.submitPhrasesTag,
  rejectPhrasesTag: phrase.rejectPhrasesTag,
  getSubmittedPhrases: phrase.getSubmittedPhrases,
  conflictPhrase: phrase.conflictPhrase,
  getPhrasesStatistics: phrase.getPhrasesStatistics,
  getUserStatistics: phrase.getUserStatistics,
  getPhrasesUploadFiles: phrase.getPhrasesUploadFiles,
  getUserFiles: phrase.getUserFiles,
  getFilesStat: phrase.getFilesStat,
  changeFileUsers: phrase.changeFileUsers,
  deleteFile: phrase.deleteFile,
  getChatRooms: chat.getChatRooms,
  getChatRoomById: chat.getChatRoomById,
  changeChatRoomMember: chat.changeChatRoomMember,
  getChatRoomsByUser: chat.getChatRoomsByUser,
  addChatRoom: chat.addChatRoom,
  getChats: chat.getChats,
  addChat: chat.addChat,
  addOrEditToDo: toDo.addOrEditToDo,
  getToDo: toDo.getToDo
};
