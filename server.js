const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const errorHandler = require("./middleware/error");
const colors = require("colors");
const connectDB = require("./config/db");
// Load env vars
dotenv.config({ path: "./config/config.env" });

// Connect to db
connectDB();

//importing routes
const bootcamps = require("./routes/bootcamps");

// initialize app
const app = express();

// Middleware

//Body-parser
app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Mounting up routes
app.use("/api/v1/bootcamps", bootcamps);

//using errorHandler
app.use(errorHandler);

const port = process.env.PORT || 5000;

const server = app.listen(
  port,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${port} 🔥`.yellow
      .bold
  )
);

// Handle unhandled promise rejections in case of db connection failures
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server and exit process
  server.close(() => process.exit(1));
});
