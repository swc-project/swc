// Correct
async function asyncFunctionGood(): Promise<number> {}
const asyncFunctionGoo2 = async (): Promise<number> => {
  return Promise.resolve(0);
}


// Need to explicit return type for async functions
// Incorrect
async function asyncFunction() {
  return 42;
}

const asyncFunction2 = async () => {
  return "Hello, World!";
}