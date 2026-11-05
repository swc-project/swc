function f() {
    try {
        throw 0;
    } catch (e) {
        return 2;
    }
}
console.log(f());
