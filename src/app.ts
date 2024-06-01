import express from "express";
import globleErrorHandler from "./middlewares/globleErrorHandler";
import userRouter from "./users/userRouter";
import bookRouter from "./books/bookRouter";
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Hello World",
  });
});

app.use("/api/users", userRouter);
app.use("/api/books", bookRouter);

// globle error handler
app.use(globleErrorHandler);

export default app;
