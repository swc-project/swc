function f(...arguments) {
    return eval("Array.isArray(arguments)");
}
console.log(f());
