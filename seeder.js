const fs = require("fs"); // File System Module
const mongoose = require("mongoose");
const colors = require("colors");
const dotenv = require("dotenv");

// Load en variables
dotenv.config({ path: "./config/config.env" });

// Load Model
const Bootcamp = require("./models/Bootcamp");
const Course = require("./models/Course");
const User = require("./models/User");
const Review = require("./models/Review");

// Connect to DB
mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

// Read JSON Files - data
const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}\\_data\\bootcamps.json`, "utf-8")
);

const courses = JSON.parse(
  fs.readFileSync(`${__dirname}\\_data\\courses.json`, "utf-8")
);

const users = JSON.parse(
  fs.readFileSync(`${__dirname}\\_data\\users.json`, "utf-8")
);

const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}\\_data\\reviews.json`, "utf-8")
);

// Import data into db

const importData = async () => {
  try {
    await Bootcamp.create(bootcamps);
    await Course.create(courses);
    await User.create(users);
    await Review.create(reviews);
    console.log("Data imported".green.inverse);
    process.exit();
  } catch (err) {
    console.log(err.red);
  }
};

// Delete Data
const deleteData = async () => {
  try {
    await Bootcamp.deleteMany();
    await Course.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log("Data deleted".red.inverse);
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  deleteData();
}
