import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import userModel from "./userModel";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import { config } from "../config/config";
import { UserInterface } from "./userTypes";
const register = async (req: Request, res: Response, next: NextFunction) => {
  console.log(req.body);

  const { name, email, password } = req.body;

  //validation

  if (!name || !email || !password) {
    const error = createHttpError(400, "All fields are required");
    return next(error);
  }

  console.log("register", name, email, password);

  //process

  // frist check is alrady register

  try {
    const user = await userModel.findOne({ email });
    if (user) {
      const error = createHttpError(400, "Email already in use");
      return next(error);
    }
  } catch (error) {
    return next(createHttpError(500, "Something went wrong"));
  }

  //has password

  const hasePassword = await bcrypt.hash(password, 10);

  let newUser: UserInterface;

  try {
    newUser = await userModel.create({
      name,
      email,
      password: hasePassword,
    });
  } catch (error) {
    return next(createHttpError(500, "Something went wrong"));
  }

  //genrate token

  try {
    const token = sign({ sub: newUser._id }, config.jwtToken, {
      expiresIn: "7d",
    });
    //response

    res.json({
      accessToken: token,
    });
  } catch (error) {
    return next(createHttpError(500, "Something went wrong"));
  }
};

export { register };
