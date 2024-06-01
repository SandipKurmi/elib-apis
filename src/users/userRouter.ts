import express from "express";
import { register } from "./userController";

const userRouter = express.Router();
userRouter.post("/register", register);

export default userRouter;
