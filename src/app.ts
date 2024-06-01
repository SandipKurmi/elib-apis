import express, { NextFunction, Request, Response } from "express";
import createHttpError, { HttpError } from "http-errors";
import { config } from "./config/config";
import globleErrorHandler from "./middlewares/globleErrorHandler";
const app = express();

app.get("/", (req, res) => {
  const error = createHttpError(404, "Not Found");
  throw error;

  res.json({
    message: "Hello World",
  });
});

// globle error handler
app.use(globleErrorHandler);

export default app;
