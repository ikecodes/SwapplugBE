const http = require("http");
const app = require("./app");
const db = require("./db/db");
const agenda = require("./services/agenda");
const dotenv = require("dotenv");

dotenv.config();
const server = http.createServer(app);

process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);
  console.log("UNCAUGHT EXCEPTION 😁");
  process.exit(1);
});

// Ports
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`App running on port ${port}...`);
  // connect to database
  db();
  // initialize agenda
  agenda.start();
});

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("UNHANDLED REJECTION 😁");
  server.close(() => {
    process.exit(1);
  });
});
