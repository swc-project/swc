var o = 0;
function f() {
    try {
        throw 1;
    } catch (b) {
        try {
            throw 2;
        } catch (a) {
            var a = 3;
            console.log(a);
        }
    }
    console.log(a);
}
f();
