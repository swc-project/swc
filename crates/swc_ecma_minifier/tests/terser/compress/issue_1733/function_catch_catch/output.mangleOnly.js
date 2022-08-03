var t = 0;
function r() {
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
r();
