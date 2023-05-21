const express = require("express");
const { RegisterUser, LoginUser, AllUsers, AuthUser } = require("../../controllers/user/UserControllers");
const { Protection } = require("../../middlewares/AuthMiddlewares");
const Routes = express.Router();

Routes.post("/create", RegisterUser);
Routes.post("/login", LoginUser);
Routes.route("/").get(Protection, AllUsers);
Routes.get("/me", Protection, AuthUser);

module.exports = Routes;