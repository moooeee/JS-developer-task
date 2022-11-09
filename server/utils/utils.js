function getRandomItem(arr) {
  const randomId = Math.floor(Math.random() * arr.length);
  return arr[randomId];
}

// shamelessly taken from stackoverflow :D
function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;

  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

function getPercentage(score, scoresList) {
  // getting scores less than the given one, then calculating the percentage
  const belowScore = scoresList.filter((_score) => _score < score);
  return (belowScore.length / scoresList.length) * 100;
}

module.exports = {
  getRandomItem,
  shuffle,
  getPercentage,
};
