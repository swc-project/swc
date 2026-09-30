function f([a = undefined] = undefined) {
    return a;
}
function g({ value: a = undefined } = void 0) {
    return a;
}
console.log(f([2]), f.length, g({ value: 3 }), g.length);
try {
    f();
} catch (error) {
    console.log(error instanceof TypeError);
}
