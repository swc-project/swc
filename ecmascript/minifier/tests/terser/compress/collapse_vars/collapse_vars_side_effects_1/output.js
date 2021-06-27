function f1() {
    var s = "abcdef",
        i = 2;
    console.log.bind(console)(s.charAt(i++), s.charAt(i++), s.charAt(i++), 7);
}
function f2() {
    var s = "abcdef",
        i = 2;
    console.log.bind(console)(
        s.charAt(i++),
        5,
        s.charAt(i++),
        s.charAt(i++),
        7
    );
}
function f3() {
    var s = "abcdef",
        i = 2,
        log = console.log.bind(console),
        x = s.charAt(i++),
        y = s.charAt(i++);
    log(x, s.charAt(i++), y, 7);
}
function f4() {
    var i = 10,
        x = (i += 2),
        y = (i += 3);
    console.log.bind(console)(x, (i += 4), y, 19);
}
f1(), f2(), f3(), f4();
