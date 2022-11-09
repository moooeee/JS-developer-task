const fs = require("fs");
const path = require("path");
const { getRandomItem, shuffle } = require("../utils/utils.js");

function handleWordsReq(req, res) {
  const data = fs.readFileSync(
    path.resolve(__dirname, "..", "testData/TestData.json")
  );
  let wordList = JSON.parse(data).wordList;

  // we want to ensure that there is at least one word of every part of speech
  // after we get them, we splice them out of the array and randomly choose from the rest of the words
  let words = [];
  const randomNoun = getRandomItem(
    wordList.filter((word) => word.pos === "noun")
  );
  const randomAdj = getRandomItem(
    wordList.filter((word) => word.pos === "adjective")
  );
  const randomAdv = getRandomItem(
    wordList.filter((word) => word.pos === "adverb")
  );
  const randomVerb = getRandomItem(
    wordList.filter((word) => word.pos === "verb")
  );
  words.push(randomNoun, randomAdj, randomAdv, randomVerb);
  wordList = wordList.filter((word) => {
    return (
      word.id !== randomNoun.id &&
      word.id !== randomAdj.id &&
      word.id !== randomAdv.id &&
      word.id !== randomVerb.id
    );
  });

  let i = 6;
  while (i > 0) {
    const randomId = Math.floor(Math.random() * wordList.length);
    const word = wordList[randomId];
    wordList.splice(randomId, 1);
    words.push(word);
    i--;
  }

  // lastly we want to shuffle our array to make sure they are not always in the same order
  words = shuffle(words);

  res.json({ words });
}

module.exports = handleWordsReq;
