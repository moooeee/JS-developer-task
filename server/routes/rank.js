const express = require("express");
const handleRankReq = require("../controllers/rankController");

const rankRouter = express.Router();

rankRouter.post("/", handleRankReq);

module.exports = rankRouter;
