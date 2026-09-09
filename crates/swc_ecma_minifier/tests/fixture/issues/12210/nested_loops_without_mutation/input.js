function f(a) {
    for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 1; j++) {
            console.log(arguments[0]);
        }
    }
}
f(1);
