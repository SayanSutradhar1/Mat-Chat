import mongoose from "mongoose";

const connection: { isConnected?: number } = {};

const connectDB = async () => {
  
  if (connection.isConnected) {
    console.log(`Already connected to database ${process.env.DB_NAME}`);
    return;
  }
  try {
    const res = await mongoose.connect(process.env.MONGO_URI || "", {
      dbName: process.env.DB_NAME,
    });
    connection.isConnected = res.connections[0].readyState;
    console.log("MongoDB Connected...");
  } catch (error) {
    console.error("Error connecting to MongoDB:", (error as Error).message);
  }
};

export { connectDB };
