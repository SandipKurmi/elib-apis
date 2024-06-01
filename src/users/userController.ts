import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";

const register = (req: Request, res: Response, next: NextFunction) => {
  console.log(req.body);

  const { name, email, password } = req.body;

  //validation

  if (!name || !email || !password) {
    const error = createHttpError(400, "All fields are required");

    console.log(error);
    return next(error);
  }

  console.log("register", name, email, password);

  //process

  //response

  res.send("register");
};

export { register };
