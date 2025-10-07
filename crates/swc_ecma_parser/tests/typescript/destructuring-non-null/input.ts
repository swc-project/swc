let arrayCopy = [1, 2];
let currentIndex = 0;
let randomIndex = 1;

// This should parse without "Not a pattern" error
[arrayCopy[currentIndex]!, arrayCopy[randomIndex]!] = [
  arrayCopy[randomIndex]!,
  arrayCopy[currentIndex]!,
];

// Also test with object destructuring
let obj = { a: 1, b: 2 };
let aIndex = 0;
let bIndex = 1;
({ a: obj[aIndex]!, b: obj[bIndex]! } = { a: 3, b: 4 });