const user = require("./User");
const calendar = require("./Calendar");
const food = require("./Food");
const tag = require("./tag");

const routes = [
  //User
  user.checkToken,
  user.signInRoute,
  user.addUser,
  user.editUser,
  user.changePassword,
  user.getUsers,
  user.getUser,
  user.deactiveUser,
  user.setUserCurrentFile,
  user.resetPassword,
  user.updateMessengerState,
  user.uploadAvatar,
  user.addOrEditUnits,
  user.getUnits,
  //Calendar
  calendar.calendar,
  //Food
  food.addFoodCategory,
  food.editFoodCategory,
  food.getFoodCategories,
  food.addFood,
  food.getFoods,
  food.addOrder,
  food.getOrders,
  food.setOrder,
  food.getOrderStat,
  food.getOrderStatForPrint,
  //Tag
  tag.addCategory,
  tag.editCategory,
  tag.getCategories,
  tag.addField,
  tag.getFields,
  tag.editField,
  tag.addTagTemplate,
  tag.getTagTemplate,
  tag.editTagTemplate,
  tag.addPhrase,
  tag.getPhrases,
  tag.deletePhrases,
  tag.editPhrase,
  tag.sendPhrasesTagForCkecker,
  tag.submitPhrasesTag,
  tag.rejectPhrasesTag,
  tag.getSubmittedPhrases,
  tag.conflictPhrase,
  tag.getPhrasesStatistics,
  tag.getUserStatistics,
  tag.getPhrasesUploadFiles,
  tag.getUserFiles,
  tag.getFilesStat,
  tag.changeFileUsers,
  tag.deleteFile,
  tag.getChatRooms,
  tag.getChatRoomById,
  tag.changeChatRoomMember,
  tag.getChatRoomsByUser,
  tag.addChatRoom,
  tag.getChats,
  tag.addChat,
  tag.addOrEditToDo,
  tag.getToDo
];

module.exports = routes;
