function b() {
    var b = {
        b: 1
    };
    console.log(b.b + 3);
}
function c() {
    var b = {
        b: {
            c: 1
        },
        d: 2
    };
    console.log(b.b + 3, b.d + 4, b.b.c + 5, b.d.c + 6);
}
