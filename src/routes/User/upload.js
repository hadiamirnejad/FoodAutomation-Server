const { connectDB } = require("../../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {User} = require("../../../models/Schemas");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

connectDB();

const storageA = multer.diskStorage({
  destination: "../Client/public/images/avatars",
  filename: (req, file, cb) => {
    cb(
      null,
      req.body.username + path.extname(file.originalname)
    );
  },
});
const uploadAvatarHandler = multer({ storage: storageA }).single("file");

const uploadAvatar = {
  path: "/api/upload/avatar",
  method: "post",
  checkTokenValidation: true,
  handler: async (req, res) => {
    uploadAvatarHandler(req, res, async (err) => {
      if (err) {
        return res.json({ error: err });
      }

      // if (fs.existsSync(`../social-client/public${req.body.oldFile}`)) {
      //   await fs.unlinkSync(`../social-client/public${req.body.oldFile}`);
      // }
      const updatetedUser = await User.updateOne({username: req.body.username}, {avatar: `/images/avatars/${req.body.username}${path.extname(req.file.originalname)}`})
      return res.json(req.file);
    });
  },
};

module.exports = { uploadAvatar };
