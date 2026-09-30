function f(a) {
    ++arguments[0].value;
    delete arguments[0].other;
    return arguments[0].value;
}
console.log(f({value: 1, other: 0}));
