let rest = [0];

function f(callback = eval("() => rest.length"), ...rest) {
    return callback();
}

console.log(f(undefined, 1, 2));
