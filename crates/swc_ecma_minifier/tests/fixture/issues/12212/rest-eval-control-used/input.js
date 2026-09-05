function f(...rest) {
    console.log(rest.length);
    return eval("rest.length");
}

console.log(f(1));
