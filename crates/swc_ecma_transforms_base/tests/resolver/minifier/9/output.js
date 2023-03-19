var o__2 = 0;
function f__2() {
    try {
        throw 1;
    } catch (c__5) {
        try {
            throw 2;
        } catch (o__3) {
            var o__3 = 3;
            console.log(o__3);
        }
    }
    console.log(o__3);
}
f__2();
