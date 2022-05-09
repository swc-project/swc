var o__1 = 0;
function f__1() {
    try {
        throw 1;
    } catch (c__3) {
        try {
            throw 2;
        } catch (o__2) {
            var o__2 = 3;
            console.log(o__2);
        }
    }
    console.log(o__2);
}
f__1();
