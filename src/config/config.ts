import { config as dotenv } from "dotenv";

dotenv();

const _config = {
  port: process.env.PORT || 3000,
  databaseUrl: process.env.MONGODB_URI || "mongodb://localhost:27017",
};

export const config = Object.freeze(_config);
