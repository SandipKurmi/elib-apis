import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import cloudinary from "../config/cloudinary";
import path from "node:path";
import bookModel from "./bookModel";
import fs from "node:fs";
import { AuthRequest } from "../middlewares/authenticate";

const createBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, genre } = req.body;

    const files = req.files as { [fileName: string]: Express.Multer.File[] };

    const coverImageMimeType = files.coverImage[0].mimetype.split("/").at(-1);

    const coverImageFileName = files.coverImage[0].filename;

    const coverImageFilePath = path.resolve(
      __dirname,
      `../../public/uploads/`,
      coverImageFileName
    );

    const coverImage = await cloudinary.uploader.upload(coverImageFilePath, {
      filename_override: coverImageFileName,
      folder: "book-covers",
      format: coverImageMimeType,
    });

    const fileMimeType = files.file[0].mimetype.split("/").at(-1);

    const fileFileName = files.file[0].filename;

    const fileFilePath = path.resolve(
      __dirname,
      `../../public/uploads/`,
      fileFileName
    );

    const file = await cloudinary.uploader.upload(fileFilePath, {
      filename_override: fileFileName,
      folder: "book-pdfs",
      format: fileMimeType,
    });

    const _req = req as AuthRequest;

    const newBook = await bookModel.create({
      title,
      genre,
      author: _req.userId,
      coverImage: coverImage.secure_url,
      file: file.secure_url,
    });

    //remove files from local

    try {
      await fs.unlinkSync(coverImageFilePath);
      await fs.unlinkSync(fileFilePath);

      console.log("files removed");
    } catch (error) {
      return next(createHttpError(500, "Something went wrong"));
    }

    res.send(newBook);
  } catch (error) {
    console.log(error);
    next(createHttpError(500, "Something went wrong"));
  }
};

const updateBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, genre } = req.body;

    const { id } = req.params;

    //check if book is in db or not

    const book = await bookModel.findById(id);

    if (!book) {
      const error = createHttpError(404, "Book not found");
      return next(error);
    }

    const _req = req as AuthRequest;

    if (book.author.toString() !== _req.userId) {
      const error = createHttpError(401, "Unauthorized");
      return next(error);
    }

    const files = req.files as { [fileName: string]: Express.Multer.File[] };

    const coverImageMimeType = files.coverImage[0].mimetype.split("/").at(-1);

    const coverImageFileName = files.coverImage[0].filename;

    const coverImageFilePath = path.resolve(
      __dirname,
      `../../public/uploads/`,
      coverImageFileName
    );

    const coverImage = await cloudinary.uploader.upload(coverImageFilePath, {
      filename_override: coverImageFileName,
      folder: "book-covers",
      format: coverImageMimeType,
    });

    const fileMimeType = files.file[0].mimetype.split("/").at(-1);

    const fileFileName = files.file[0].filename;

    const fileFilePath = path.resolve(
      __dirname,
      `../../public/uploads/`,
      fileFileName
    );

    const file = await cloudinary.uploader.upload(fileFilePath, {
      filename_override: fileFileName,
      folder: "book-pdfs",
      format: fileMimeType,
    });

    const updatedBook = await bookModel.findByIdAndUpdate(id, {
      title,
      genre,
      author: _req.userId,
      coverImage: coverImage.secure_url,
      file: file.secure_url,
    });

    //remove files from local

    try {
      await fs.unlinkSync(coverImageFilePath);
      await fs.unlinkSync(fileFilePath);
    } catch (error) {
      return next(createHttpError(500, "Something went wrong"));
    }

    res.send(updatedBook);
  } catch (error) {
    next(createHttpError(500, "Something went wrong"));
  }
};

const getAllBooks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const books = await bookModel.find();
    res.send(books);
  } catch (error) {
    next(createHttpError(500, "Something went wrong"));
  }
};

// getSingleBook

const getSingleBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const book = await bookModel.findById(id);

    if (!book) {
      return next(createHttpError(404, "Book not found"));
    }

    res.send(book);
  } catch (error) {
    next(createHttpError(500, "Something went wrong"));
  }
};

// /deleteBook

const deleteBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const book = await bookModel.findById(id);

    if (!book) {
      return next(createHttpError(404, "Book not found"));
    }

    const _req = req as AuthRequest;

    if (book.author.toString() !== _req.userId) {
      const error = createHttpError(401, "Unauthorized");
      return next(error);
    }

    //remove file from cloudinary

    try {
      const { coverImage, file } = book;

      const coverFileSplit = coverImage.split("/");

      console.log(coverFileSplit);

      const coverFilePublicId =
        coverFileSplit.at(-2) + "/" + coverFileSplit.at(-1)?.split(".").at(-2);

      const fileFileSplit = file.split("/");

      console.log(fileFileSplit);

      const fileFilePublicId =
        fileFileSplit.at(-2) + "/" + fileFileSplit.at(-1)?.split(".").at(-2);
      console.log(fileFilePublicId);

      await cloudinary.uploader.destroy(coverFilePublicId);
      await cloudinary.uploader.destroy(fileFilePublicId, {
        resource_type: "raw",
      });

      const removeBook = await bookModel.findByIdAndDelete(id);

      if (!removeBook) {
        return next(createHttpError(404, "Book not found"));
      }

      res.sendStatus(204).send(removeBook._id);
    } catch (error) {
      return next(createHttpError(500, "Something went wrong"));
    }
  } catch (error) {
    next(createHttpError(500, "Something went wrong"));
  }
};

export { createBook, updateBook, getAllBooks, getSingleBook, deleteBook };
