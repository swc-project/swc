function f1() {
    var dummy = 3,
        a = 5,
        unused = 2,
        a = 1,
        a = 3;
    return -a;
}
function f2(x) {
    var a = 3,
        a = x;
    return a;
}
(function (x) {
    var a = "GOOD" + x,
        e = "BAD",
        k = "!",
        e = a;
    console.log(e + k);
})("!"),
    (function (x) {
        var a = "GOOD" + x,
            e = "BAD" + x,
            k = "!",
            e = a;
        console.log(e + k);
    })("!");
