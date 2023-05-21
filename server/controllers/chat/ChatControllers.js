const asyncHandler = require("express-async-handler");
const Chat = require("../../models/chat/ChatModel");
const User = require("../../models/users/UserModel");

const CreateChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if(!userId) {
    console.log("UserId param not sent with requests!");
    return res.sendStatus(400);
  }

  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      {
        users: {
          $elemMatch: {
            $eq: req.user._id
          }
        },
      },
      {
        users: {
          $elemMatch: {
            $eq: userId
          }
        },
      }
    ]
  })
  .populate("users", "-password")
  .populate("latestMessage");
  
  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name avatar email"
  });

  if(isChat.length > 0) {
    res.send(isChat[0]);
  } else{
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId]
    };

    try {
      const createChat = await Chat.create(chatData);
      
      const foundedChat = await Chat.findOne({_id: createChat._id})
        .populate("users", "-password");
        
      if(foundedChat) {
        res.status(200).send(foundedChat);
      }
    } catch(e) {
      res.status(400);
      throw new Error(e.message);
    }
  };
});

const CreateGroup = asyncHandler(async (req, res) => {
  if(!req.body.users || !req.body.name) {
    return res.status(400).send({message: "Please fill all the Fields"});
  };

  var users = JSON.parse(req.body.users);

  if(users.length < 2) {
    return res
      .status(400)
      .send("More than 2 users are required to form a group chat!");
  };

  users.push(req.user);

  try {
    const group = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user
    });

    const createdChat = await Chat.findOne({
      _id: group._id
    })
    .populate("users", "-password")
    .populate("groupAdmin", "-password")

    res.status(200).json(createdChat);
  } catch(e) {
    res.status(400);
    throw new Error(e.message);
  }
});

const GetAllChats = asyncHandler(async (req, res) => {
  try {
    Chat.find({
      users : {
        $elemMatch: {
          $eq: req.user._id
        }
      }
    })
    .populate("users", "-password")
    .populate("groupAdmin", "-password")
    .populate("latestMessage")
    .sort({ updateAt: -1 })
    .then( async (result) => {
      result = await User.populate(result, {
        path: "latestMessage.sender",
        select: "name avatar email"
      });

      res.status(200).send(result)
    })
  } catch(e) {
    res.status(400);
    throw new Error(e.message);
  }
});

const RenameGroup = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;
  const foundGroup = await Chat.findByIdAndUpdate(chatId, 
    {
      chatName: chatName
    },
    {
      new: true,
    }
  )
  .populate("users", "-password")
  .populate("groupAdmin", "-password")

  if(!foundGroup) {
    res.status(400);
    throw new Error("Chat not Found!")
  } else {
    res.json(foundGroup);
  };
});

const AddUserToGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  const foundGroup = await Chat.findByIdAndUpdate(chatId, 
    {
      $push: { users: userId }
    },
    {
      new: true,
    }
  )
  .populate("users", "-password")
  .populate("groupAdmin", "-password")

  if(!foundGroup) {
    res.status(404);
    throw new Error("Chat not Found!")
  } else {
    res.json(foundGroup);
  };
});

const DeleteUserFromGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  const founded = await Chat.findByIdAndDelete(chatId,
    {
      $pull: { users: userId },
    },
    {
      new: true
    }
  );

  if(!founded) {
    res.status(404);
    throw new Error("Chat not Found!")
  } else {
    res.json(founded);
  };
});

module.exports = {
  CreateChat,
  GetAllChats,
  CreateGroup,
  RenameGroup,
  AddUserToGroup,
  DeleteUserFromGroup
};