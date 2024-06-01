import { config as dotenv } from "dotenv";

dotenv();

const _config = {
  port: process.env.PORT || 3000,
  databaseUrl: process.env.MONGODB_URI || "mongodb://localhost:27017",
  env: process.env.NODE_ENV || "development",
  jwtToken: process.env.JWT_SECRET || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
};

export const config = Object.freeze(_config);
