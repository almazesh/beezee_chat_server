const generateToken = require("../../helpers/generateToken");
const asyncHandler = require("express-async-handler");
const User = require("../../models/users/UserModel");

const RegisterUser = asyncHandler(async (req, res) => {
  const { name, email, password, avatar } = req.body;

  if(!name || !email || !password) {
    res.status(400);
    throw new Error("Please Enter all the Fields");
  };

  const isUser = await User.findOne({ email });

  if(isUser) {
    res.status(400);
    throw new Error("User already exists!");
  };

  const NewUser = await User.create({
    name,
    email,
    password,
    avatar
  });

  if(NewUser) {
    res.status(201).json({
      _id: NewUser._id,
      name: NewUser.name,
      email: NewUser.email,
      password: NewUser.password,
      avatar: NewUser.avatar,
      token: generateToken(NewUser._id),
    });
  } else {
    res.status(400);
    throw new Error("Failed to Create the User!");
  }
});

const LoginUser = asyncHandler( async (req, res) => {
  const { email, password } = req.body;

  const isUser = await User.findOne({ email });

  if(isUser && (await isUser.matchPassword(password))) {
    res.json({
      _id: isUser._id,
      name: isUser.name,
      email: isUser.email,
      avatar: isUser.avatar,
      token: generateToken(isUser._id),
    })
  } else {
    res.status(401);
    throw new Error("Ivalid Password or Email!");
  };
  
});


const AllUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search ? {
    $or: [
      {
        name: {
          $regex: req.query.search,
          $options: "i"
        },
        email: {
          $regex: req.query.search,
          $options: "i"
        }
      }
    ]
  } : null;

  const isUsers = 
    await User.find(keyword)
    .find({
      _id: {
        $ne: req.user._id
      }
    });
  
    res.send(isUsers);
});


module.exports = { 
  RegisterUser,
  LoginUser,
  AllUsers
}