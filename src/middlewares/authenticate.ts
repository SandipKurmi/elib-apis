import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";

import { verify } from "jsonwebtoken";
import { config } from "../config/config";

export interface AuthRequest extends Request {
  userId: string;
}

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      const error = createHttpError(401, "Unauthorized");
      return next(error);
    }

    const token = authorization.split(" ")[1];

    if (!token) {
      const error = createHttpError(401, "Unauthorized");
      return next(error);
    }

    try {
      const decoded = verify(token, config.jwtToken);

      const _req = req as AuthRequest;

      _req.userId = decoded.sub as string;
      next();
    } catch (error) {
      const err = createHttpError(401, "Unauthorized");
      return next(err);
    }
  } catch (error) {
    const err = createHttpError(401, "Unauthorized");
    return next(err);
  }
};

export default authenticate;
