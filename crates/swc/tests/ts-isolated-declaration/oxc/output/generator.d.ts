// Correct
declare function* generatorGood(): Generator<number>;
// Need to explicit return type for async functions
// Incorrect
declare function* generatorGoodBad();
