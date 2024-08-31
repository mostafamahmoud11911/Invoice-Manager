import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB!);

  } catch (error: any) {
    console.log("error", error);
  }
};
