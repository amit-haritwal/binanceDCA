import express from "express";
import investRouter from "./investingRoutes";
var cors = require("cors");
require("dotenv").config();
const app = express();

// Middleware required
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const whitelist = ["*"];

var corsOptionsDelegate = function (req: any, callback: any) {
  var corsOptions;
  if (whitelist.indexOf(req.header("Origin")) !== -1) {
    corsOptions = { origin: true, credentials: true }; // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false }; // disable CORS for this request
  }
  callback(null, corsOptions); // callback expects two parameters: error and options
};

//use cors middleware
app.use(cors(corsOptionsDelegate));
// routes
const url = "/api/v1";
app.use(url, investRouter);
// Health check route

app.use("/health-check", (req, res) => {
  res.send("Healthy");
});

// connection
app.listen(process.env.PORT || 8080, () => {
  console.log(`Server is running on port ${process.env.PORT || 8080}`);
});
