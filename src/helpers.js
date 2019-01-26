export function shuffleArray(array) {
  let i = array.length - 1;
  for (; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

export function extractValueFromCardRepr(cardRepr) {
  return cardRepr.substring(0, cardRepr.length - 1);
}

export function extractColorFromCardRepr(cardRepr) {
  return cardRepr.substring(cardRepr.length - 1);
}
