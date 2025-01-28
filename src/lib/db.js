import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/scholarsbox';

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

let cached = global._mongo;  // For keeping the connection cache

if (!cached) {
  cached = global._mongo = { conn: null, promise: null };
}

const connectToDatabase = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {

    cached.promise = mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,
    })    
      .then((mongooseInstance) => mongooseInstance)
      .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
        throw new Error('MongoDB connection failed');
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};

export default connectToDatabase;
