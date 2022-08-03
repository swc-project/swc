var o = 0;
function f() {
    try {
        throw 1;
    } catch (t) {
        try {
            throw 2;
        } catch (r) {
            var r = 3;
            console.log(r);
        }
    }
    console.log(r);
}
f();
