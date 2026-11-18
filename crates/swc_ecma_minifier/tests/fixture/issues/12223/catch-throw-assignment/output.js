function f() {
    var a = 1;
    try {
        throw 0;
    } catch (e) {
        throw a = 2;
    } finally{
        console.log(a);
    }
}
try {
    f();
} catch (e) {
    console.log(e);
}
