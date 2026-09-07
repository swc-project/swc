function f() {
    var a = 1;
    try {
        throw 0;
    } catch (e) {
        return a = 2;
    } finally{
        console.log(a);
    }
}
console.log(f());
