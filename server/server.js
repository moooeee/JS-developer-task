const express = require("express");
const dotenv = require("dotenv");
const fs = require("fs");
const morgan = require("morgan");
const path = require("path");
const { json } = require("express");
const cors = require("cors");
const wordsRouter = require("./routes/words.js");
const rankRouter = require("./routes/rank.js");

// typically we would have a config.env to store sensitive info
dotenv.config({ path: "./config.env" });

const app = express();
// parses incoming JSON requests and puts the parsed data in req.body
app.use(express.json());
// we want to enable cors in order to be able to send requests from client to server
// otherwise requests will be blocked by same-origin policy
app.use(cors());

if (process.env.NODE_ENV === "development") {
  // handy middleware to log useful info about requests
  app.use(morgan("dev"));
}

// we utilise middleware for routing
app.use("/words", wordsRouter);
app.use("/rank", rankRouter);

const port = process.env.PORT || 8080;
const server = app.listen(port, () => {
  console.log(`lets go!`);
});
