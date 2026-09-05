function original() {
    return "original";
}

function replacement() {
    return "replacement";
}

function run(f, x) {
    return (arguments[0] = replacement) ? f(1, x) : f(2, x);
}

console.log(run(original, 0));
