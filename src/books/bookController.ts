import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import cloudinary from "../config/cloudinary";
import path from "node:path";

const createBook = async (req: Request, res: Response, next: NextFunction) => {
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

  res.send(req.files);
};

export { createBook };
