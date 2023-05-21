
const express = require("express");
const dotenv = require("dotenv")
const cors = require("cors");

const chats = require("./data/data");
const connectDB = require("./config/db");
const UserRoutes = require("./routes/user/UserRoutes");
const ChatRoutes = require("./routes/chat/ChatRoutes");
const { NotFound, ErrorHandler } = require("./middlewares/ErrorMiddleware");

const app = express();

app.use(express.json());
dotenv.config();
connectDB();
app.use(cors());

app.use("/api/user", UserRoutes);
app.use("/api/chat", ChatRoutes)

app.use(NotFound);
app.use(ErrorHandler);

const PORT = process.env.PORT || 5444;

app.listen(PORT, () => console.log(`Server listening on PORT - ${PORT}`));