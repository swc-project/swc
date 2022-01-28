function f(c) {
    var a;
    if (c) {
        let b;
        return (a = 2) + (b = 3);
    }
}
console.log(f(1));
