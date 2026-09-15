let rest = [0];

function functionDefault(...rest) {
    return function (callback = eval("() => rest.length")) {
        var rest;
        return callback();
    }();
}

function arrowDefault(...rest) {
    return ((callback = eval("() => rest.length")) => {
        var rest;
        return callback();
    })();
}

console.log(functionDefault(1, 2));
console.log(arrowDefault(1, 2));
