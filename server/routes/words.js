const express = require("express");
const handleWordsReq = require("../controllers/wordsController");

const wordsRouter = express.Router();

wordsRouter.get("/", handleWordsReq);

module.exports = wordsRouter;
