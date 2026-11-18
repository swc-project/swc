var state;
function f(x) {
    state = x, console.log("side", x), state++;
}
console.log(f(1), state), console.log(f(2), state);
