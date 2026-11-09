var state;
function f(x) {
    return (state = void console.log("side", x));
}
console.log(f(1), state);
console.log(f(2), state);
