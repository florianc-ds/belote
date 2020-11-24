const base32Encode = require('base32-encode')

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

export function encrypt(value, key) {
  // encode in base 32
  var encoder = new TextEncoder()
  var encoded_value = base32Encode(encoder.encode(value), 'RFC3548')
  var encoded_key = base32Encode(encoder.encode(key), 'RFC3548')

  // apply vigenere transformation
  const ALPHABET = [
    "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P",
    "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "2", "3", "4", "5", "6", "7",
    "="
  ]
  var i;
  var encrypted_value = ""
  for (i = 0; i < encoded_value.length; i++){
    var key_letter = encoded_key.charAt(i % encoded_key.length)
    var key_letter_index = ALPHABET.indexOf(key_letter)
    var letter = encoded_value.charAt(i)
    var letter_index = ALPHABET.indexOf(letter)
    var encrypted_letter_index = (letter_index + key_letter_index) % ALPHABET.length
    encrypted_value += ALPHABET[encrypted_letter_index]
  }

  return encrypted_value;
}
