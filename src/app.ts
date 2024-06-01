import express, { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import globleErrorHandler from "./middlewares/globleErrorHandler";
import userRouter from "./users/userRouter";
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Hello World",
  });
});

app.use("/api/users", userRouter);

// globle error handler
app.use(globleErrorHandler);

export default app;
