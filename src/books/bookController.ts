import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";

const createBook = async (req: Request, res: Response, next: NextFunction) => {
  const {} = req.body;
  res.send("Hello World");
};

export { createBook };
