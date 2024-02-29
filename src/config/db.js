const mongoose = require('mongoose');
const connectDB = async()=> {
  try {
    mongoose.set('strictQuery', false);
    const conn = await mongoose.connect(process.env.MONGODB_URI,{
      serverSelectionTimeoutMS: 1200000, // Timeout in milliseconds
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    console.log(`Database Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
  }
}



module.exports = connectDB;

