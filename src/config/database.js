import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDatabase = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MongoDB URI is not defined in environment variables");
    }
    const connect = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`MongoDB Database Connected Successfully`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export default connectDatabase;
