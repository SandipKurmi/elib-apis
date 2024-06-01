import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import cloudinary from "../config/cloudinary";
import path from "node:path";
import bookModel from "./bookModel";
import fs from "node:fs";

const createBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, genre } = req.body;

    console.log("files", req.files);

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

    console.log("coverImage", coverImage);

    const fileMimeType = files.file[0].mimetype.split("/").at(-1);

    const fileFileName = files.file[0].filename;

    const fileFilePath = path.resolve(
      __dirname,
      `../../public/uploads/`,
      fileFileName
    );

    const file = await cloudinary.uploader.upload(fileFilePath, {
      filename_override: fileFileName,
      folder: "book-files",
      format: fileMimeType,
    });

    console.log("file", file);

    const newBook = await bookModel.create({
      title,
      genre,
      author: "665ad92354cfa00f29905eac",
      coverImage: coverImage.secure_url,
      file: file.secure_url,
    });

    console.log("newBook", newBook);

    //remove files from local

    try {
      const coverImageFilePathLocal = path.resolve(
        __dirname,
        `../../public/uploads/`,
        coverImageFileName
      );

      const fileFilePathLocal = path.resolve(
        __dirname,
        `../../public/uploads/`,
        fileFileName
      );

      await fs.unlinkSync(coverImageFilePathLocal);
      await fs.unlinkSync(fileFilePathLocal);
    } catch (error) {
      return next(createHttpError(500, "Something went wrong"));
    }

    res.send(newBook);
  } catch (error) {
    console.log(error);
    next(createHttpError(500, "Something went wrong"));
  }
};

export { createBook };
