var o = 0;
function c() {
    try {
        throw 1;
    } catch (o) {
        try {
            throw 2;
        } catch (c) {
            var c = 3;
            console.log(c);
        }
    }
    console.log(c);
}
c();
