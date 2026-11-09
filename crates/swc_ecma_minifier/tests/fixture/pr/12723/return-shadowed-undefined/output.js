// `undefined` is a parameter here, so it must not be treated as the global value.
function f(undefined) {
    return console.log("side"), undefined;
}
console.log(f(1)), console.log(f(2));
