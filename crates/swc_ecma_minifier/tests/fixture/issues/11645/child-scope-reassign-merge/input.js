function run(cond) {
    let f = (a) => a;

    if (cond) {
        f = (a, b) => b;
    }

    return f(1, 2);
}

console.log(run(true), run(false));
