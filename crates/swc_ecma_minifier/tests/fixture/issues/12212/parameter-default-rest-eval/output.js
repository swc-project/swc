let rest = [
    0
];
function f(callback = eval("() => rest.length"), ...rest) {
    return callback();
}
console.log(f(void 0, 1, 2));
