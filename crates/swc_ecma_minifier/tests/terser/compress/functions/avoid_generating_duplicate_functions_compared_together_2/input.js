const defaultArg = (input) => input;
const fn = (arg = defaultArg) => arg;
console.log(fn() === fn());
