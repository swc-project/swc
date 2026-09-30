function f(a, ...rest) {
    a = 2;
    return [
        arguments[0],
        rest.length
    ];
}
console.log(f(1));
