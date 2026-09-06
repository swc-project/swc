function f(value, ...rest) {
    let arguments = [];
    return arguments.length;
}

function functionBinding(value, ...rest) {
    function arguments() {}
    return typeof arguments;
}

console.log(f("ignored"));
console.log(functionBinding("ignored"));
