var o = 0;
function f() {
    try {
        throw 1;
    } catch (c) {
        try {
            throw 2;
        } catch (t) {
            var t = 3;
            console.log(t);
        }
    }
    console.log(t);
}
f();
