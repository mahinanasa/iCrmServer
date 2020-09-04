const mongoose = require('mongoose');

const connectDB = async () => {
 const conn = await mongoose.connect(
    "mongodb://admin:crm123456@ds259596.mlab.com:59596/crm-app",
    {
      useNewUrlParser: true,
      //useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true
    }
  );
  console.log(`Mongo db connected on ${conn.connection.host}`.cyan.underline.bold);
}

module.exports = connectDB;
