function f() {
    var a = 1;
    try {
        throw 0;
    } catch (e) {
        return a = 2;
    }
}

console.log(f());
