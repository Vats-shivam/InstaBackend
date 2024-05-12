import express from "express";
import { createUser, loginUser } from "../controller/userController.js";
const userRouter = express.Router();



userRouter.route("/createUser").post(createUser);
userRouter.route("/login").post(loginUser);

export default userRouter;