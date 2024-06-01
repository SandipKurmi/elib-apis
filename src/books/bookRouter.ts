import express from "express";
import {
  createBook,
  getAllBooks,
  getSingleBook,
  updateBook,
} from "./bookController";
import multer from "multer";
import path from "node:path";
import authenticate from "../middlewares/authenticate";

const bookRouter = express.Router();

const upload = multer({
  dest: path.resolve(__dirname, "../../public/uploads"),
  limits: { fileSize: 3e7 }, // 30 MB
});

bookRouter.post(
  "/",
  authenticate,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  createBook
);

//update single book

bookRouter.put(
  "/:id",
  authenticate,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  updateBook
);

//get book list

bookRouter.get("/", getAllBooks);

//get single book

bookRouter.get("/:id", getSingleBook);

export default bookRouter;
