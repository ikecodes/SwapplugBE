const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");

const errorHandler = require("./middlewares/errorHandler");
const routes = require("./routers");

const app = express();

app.set("veiw engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(helmet());
app.use(
  cors({
    origin: "*",
  })
);
app.use(xss());
app.use(cors());
app.use(mongoSanitize());

app.use("/api/v1/", routes);

// health check
app.get("/", (req, res) => {
  res.status(200).json({
    status: true,
    message: "Welcome to Trade By Barter App",
  });
});

app.use(errorHandler);

module.exports = app;
