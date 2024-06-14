import mongoose from "mongoose";

const connectToMongoDB = async () => {
  try {
    await mongoose.connect(`mongodb+srv://admin:qwe@cluster0.mlolzfs.mongodb.net/maindb?retryWrites=true&w=majority&appName=Cluster0`);
    console.log('Connected to MongoDB...');
  } catch (error) {
    console.error('Error connecting to MongoDB: ', error);
  }
}

export default connectToMongoDB;