// Correct
function *generatorGood(): Generator<number> {}


// Need to explicit return type for async functions
// Incorrect
function *generatorGoodBad() {
  yield 50;
  return 42;
}