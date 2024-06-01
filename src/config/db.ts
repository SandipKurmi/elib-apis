import mongoose from "mongoose";
import { config } from "./config";

const connectDB = async () => {
  try {
    const { databaseUrl } = config;

    mongoose.connection.on("connected", () => {
      console.log("MongoDB connected");
    });

    mongoose.connection.on("error", (error) => {
      console.log(`MongoDB connection error: ${error}`);
    });
    await mongoose.connect(databaseUrl);
  } catch (error) {
    console.log(error);

    process.exit(1);
  }
};

export default connectDB;
