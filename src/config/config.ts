import { config as dotenv } from "dotenv";

dotenv();

const _config = {
  port: process.env.PORT || 3000,
  databaseUrl: process.env.MONGODB_URI || "mongodb://localhost:27017",
  env: process.env.NODE_ENV || "development",
  jwtToken: process.env.JWT_SECRET || "jwt-secret",
  cloudName: process.env.CLOUDINARY_NAME,
  apiKey: process.env.CLOUDINARY_API_KEY,
  apiSecret: process.env.CLOUDINARY_API_SECRET,
};

export const config = Object.freeze(_config);
