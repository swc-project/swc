var o = 0;
function c() {
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
c();
