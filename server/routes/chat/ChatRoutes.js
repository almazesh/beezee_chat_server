const express = require("express");
const { 
  CreateChat, 
  GetAllChats, 
  CreateGroup, 
  RenameGroup, 
  AddUserToGroup, 
  DeleteUserFromGroup 
} = require("../../controllers/chat/ChatControllers");
const { Protection } = require("../../middlewares/AuthMiddlewares");

const Routes = express.Router();

Routes.post("/create", Protection, CreateChat);
Routes.post("/create/group", Protection, CreateGroup);
Routes.get("/all", Protection, GetAllChats);
Routes.put("/rename", Protection, RenameGroup);
Routes.put("/delete/user", Protection, DeleteUserFromGroup);
Routes.put("/add/user", Protection, AddUserToGroup);

module.exports = Routes;