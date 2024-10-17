function f1() {
    try {
        return 1;
    } catch (ex) {
        return 2;
    } finally{
        return 3;
    }
}
function f2() {
    var t = could_throw();
    try {
        return t + might_throw();
    } catch (ex) {
        return 3;
    }
}
