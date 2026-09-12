function f(value) {
    let arguments = [];
    return arguments.length;
}
function functionBinding(value) {
    function arguments() {}
    return typeof arguments;
}
console.log(f("ignored"));
console.log(functionBinding("ignored"));
