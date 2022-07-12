const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");

const errorHandler = require("./middlewares/errorHandler");
const userRouter = require("./routers/userRouter");
const productRouter = require("./routers/productRouter");
const orderRouter = require("./routers/orderRouter");
const favoriteRouter = require("./routers/favoriteRouter");
const reviewRouter = require("./routers/reviewRouter");
const transactionRouter = require("./routers/transactionRouter");
const payoutRouter = require("./routers/payoutRouter");
const bankRouter = require("./routers/bankRouter");

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

app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/favorites", favoriteRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/transactions", transactionRouter);
app.use("/api/v1/payouts", payoutRouter);
app.use("/api/v1/banks", bankRouter);

// home
app.get("/", (req, res) => {
  res.status(200).json({
    status: true,
    message: "Welcome to Trade By Barter App",
  });
});

app.use(errorHandler);

module.exports = app;
