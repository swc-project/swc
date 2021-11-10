function f(c) {
    if (c) {
        let b;
        return 2 + (b = 3);
    }
}
console.log(f(1));
