import mongoose from 'mongoose';
import env from './env.js';

const connectDB = async () => {
  if (!env.mongodbUri) {
    throw new Error('MONGODB_URI is not defined in environment variables');
  }

  await mongoose.connect(env.mongodbUri);
  console.log('MongoDB connected');
};

export default connectDB;
