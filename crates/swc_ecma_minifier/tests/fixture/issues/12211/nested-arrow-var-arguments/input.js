function f(value, ...rest) {
    return (() => {
        var arguments = [];
        return arguments.length;
    })();
}

console.log(f("ignored"));
