const fs = require("fs");
const path = require("path");
const { getPercentage } = require("../utils/utils.js");

function handleRankReq(req, res) {
  const score = req.body.score;

  const file = fs.readFileSync(
    path.resolve(__dirname, "..", "testData/TestData.json")
  );
  let wordsList = JSON.parse(file).scoresList;

  const percentage = getPercentage(score, wordsList);

  res.json({ perc: percentage });
}

module.exports = handleRankReq;
