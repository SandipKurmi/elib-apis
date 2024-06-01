import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import userModel from "./userModel";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import { config } from "../config/config";
import { UserInterface } from "./userTypes";
const register = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;

  //validation

  if (!name || !email || !password) {
    const error = createHttpError(400, "All fields are required");
    return next(error);
  }

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

    res.status(201).json({
      accessToken: token,
    });
  } catch (error) {
    return next(createHttpError(500, "Something went wrong"));
  }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  //validation

  const { email, password } = req.body;

  if (!email || !password) {
    const error = createHttpError(400, "All fields are required");
    return next(error);
  }

  //process

  //check user is in db or not

  let user: UserInterface | null;
  try {
    user = await userModel.findOne({ email });

    if (!user) {
      const error = createHttpError(400, "User not found");
      return next(error);
    }
  } catch (error) {
    return next(createHttpError(500, "Something went wrong"));
  }

  //check password

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    const error = createHttpError(400, "Invalid credentials");
    return next(error);
  }

  //genrate token

  try {
    const token = sign({ sub: user._id }, config.jwtToken, {
      expiresIn: "7d",
    });
    //response

    res.status(200).json({
      accessToken: token,
    });
  } catch (error) {
    return next(createHttpError(500, "Something went wrong"));
  }

  //response
};

export { register, login };
