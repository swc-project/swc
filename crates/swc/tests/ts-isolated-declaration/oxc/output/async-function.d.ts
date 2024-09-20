// Correct
declare async function asyncFunctionGood(): Promise<number>;
declare const asyncFunctionGoo2: () => Promise<number>;
// Need to explicit return type for async functions
// Incorrect
declare async function asyncFunction();
declare const asyncFunction2: () => any;
