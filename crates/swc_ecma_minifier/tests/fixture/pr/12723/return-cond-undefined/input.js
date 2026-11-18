function f(x) {
    return console.log("side", x), x ? void 0 : undefined;
}
console.log(f(1), f(0));
console.log(f(2), f(0));
