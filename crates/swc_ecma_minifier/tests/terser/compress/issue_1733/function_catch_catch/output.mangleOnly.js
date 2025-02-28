var c = 0;
function o() {
    try {
        throw 1;
    } catch (c) {
        try {
            throw 2;
        } catch (o) {
            var o = 3;
            console.log(o);
        }
    }
    console.log(o);
}
o();
