// Correct
function *generatorGood(): Generator<number> {}

class GeneratorClassGood {
  *method(): Generator<number> {
    yield 50;
    return 42;
  }
}



// Need to explicit return type for async functions
// Incorrect
function *generatorBad() {
  yield 50;
  return 42;
}

class GeneratorClassBad {
  *method() {
    yield 50;
    return 42;
  }
}
