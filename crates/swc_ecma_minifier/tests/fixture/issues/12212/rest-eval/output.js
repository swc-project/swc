function f(...rest) {
    return eval("rest.length");
}
console.log(f(1));
