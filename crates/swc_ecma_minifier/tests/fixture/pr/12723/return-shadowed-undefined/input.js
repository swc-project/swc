// `undefined` is a parameter here, so it must not be treated as the global value.
function f(undefined) {
    console.log("side");
    return undefined;
}
console.log(f(1));
console.log(f(2));
