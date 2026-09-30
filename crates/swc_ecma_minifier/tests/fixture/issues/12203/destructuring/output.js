function f([a] = void 0) {
    return a;
}
function g({ value: a } = void 0) {
    return a;
}
console.log(f([
    2
]), f.length, g({
    value: 3
}), g.length);
try {
    f();
} catch (error) {
    console.log(error instanceof TypeError);
}
