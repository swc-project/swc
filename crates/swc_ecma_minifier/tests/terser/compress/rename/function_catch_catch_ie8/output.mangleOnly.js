var a = 0;
function b() {
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
b();
