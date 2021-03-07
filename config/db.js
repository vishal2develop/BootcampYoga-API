const mongoose = require("mongoose");

const connectDB = async () => {
  const conn = await mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  });
  console.log(
    `Mongo DB Connected: ${conn.connection.host}`.cyan.underline.bold
  );
};

module.exports = connectDB;
