import { NextFunction, Request, Response } from "express";
import { HttpError } from "http-errors";
import { config } from "../config/config";

const globleErrorHandler = (
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    status: "error",
    statusCode,
    message: err.message,
    errorStack: config.env === "development" ? err.stack : null,
  });
};

export default globleErrorHandler;
