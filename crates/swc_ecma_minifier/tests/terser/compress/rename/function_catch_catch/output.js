var o = 0;
function f() {
    try {
        throw 1;
    } catch (t) {
        try {
            throw 2;
        } catch (c) {
            var c = 3;
            console.log(c);
        }
    }
    console.log(c);
}
f();
