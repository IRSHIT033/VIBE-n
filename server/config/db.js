import mongoose from "mongoose";
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB connected : ${conn.connection.host}`.yellow.bold);
  } catch (err) {
    console.log(`Error: ${err}`.red.bold);
  }
};

export default connectDB;
