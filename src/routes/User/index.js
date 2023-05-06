const user = require("./users");
const upload = require("./upload");
const unit = require("./unit");

module.exports = {
  checkToken: user.checkToken,
  signInRoute: user.signInRoute,
  addUser: user.addUser,
  editUser: user.editUser,
  changePassword: user.changePassword,
  getUsers: user.getUsers,
  getUser: user.getUser,
  deactiveUser: user.deactiveUser,
  setUserCurrentFile: user.setUserCurrentFile,
  resetPassword: user.resetPassword,
  updateMessengerState: user.updateMessengerState,
  uploadAvatar: upload.uploadAvatar,
  addOrEditUnits: unit.addOrEditUnits,
  getUnits: unit.getUnits,
}