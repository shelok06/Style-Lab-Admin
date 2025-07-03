import mongoose from "mongoose";

const connectDB = async () => {
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };
  try {
    console.log("connecting")
    const conn = await mongoose.connect(process.env.MONGODB_URI, clientOptions);
    console.log(`MongoDB Connected`);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

export default connectDB