const express = require("express");
const { RegisterUser, LoginUser, AllUsers } = require("../../controllers/user/UserControllers");
const { Protection } = require("../../middlewares/AuthMiddlewares");
const Routes = express.Router();

Routes.post("/create", RegisterUser);
Routes.post("/login", LoginUser);
Routes.get("/all", Protection, AllUsers);

module.exports = Routes;