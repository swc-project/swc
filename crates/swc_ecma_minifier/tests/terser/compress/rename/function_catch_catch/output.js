var o = 0;
function f() {
    try {
        throw 1;
    } catch (a) {
        try {
            throw 2;
        } catch (b) {
            var b = 3;
            console.log(b);
        }
    }
    console.log(b);
}
f();
