var state;
function f(x) {
    return state = x, (console.log("side", x), void state++);
}
console.log(f(1), state);
console.log(f(2), state);
