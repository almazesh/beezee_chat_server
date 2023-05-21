
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserModel = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: "https://ps.w.org/user-avatar-reloaded/assets/icon-256x256.png?rev=2540745"
    },
  },
  {
    timestamps: true
  }
);

UserModel.methods.matchPassword = async function(p) {
  return await bcrypt.compare(p, this.password)
}

UserModel.pre("save", async function(next) {
  if(!this.isModified) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

});

const User = mongoose.model("User", UserModel);

module.exports = User;