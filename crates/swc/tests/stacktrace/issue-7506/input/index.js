function getStackTrace() {
    throw new Error()
}

let stack;
function namedCallingFunction() {
    stack = getStackTrace();
}
namedCallingFunction();

