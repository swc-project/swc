var a = 0;
!(function(a) {
    a = 0;
})([
    {
        0: (a = a + 1),
        length: (a = 1 + a)
    },
    typeof void (function c() {
        var b = (function a(b) {})(b && (b.b += ((a = a + 1), 0)));
    })(), 
]);
console.log(a);
