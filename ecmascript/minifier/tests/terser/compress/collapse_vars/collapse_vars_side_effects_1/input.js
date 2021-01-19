function f1() {
    var e = 7;
    var s = "abcdef";
    var i = 2;
    var log = console.log.bind(console);
    var x = s.charAt(i++);
    var y = s.charAt(i++);
    var z = s.charAt(i++);
    log(x, y, z, e);
}
function f2() {
    var e = 7;
    var log = console.log.bind(console);
    var s = "abcdef";
    var i = 2;
    var x = s.charAt(i++);
    var y = s.charAt(i++);
    var z = s.charAt(i++);
    log(x, i, y, z, e);
}
function f3() {
    var e = 7;
    var s = "abcdef";
    var i = 2;
    var log = console.log.bind(console);
    var x = s.charAt(i++);
    var y = s.charAt(i++);
    var z = s.charAt(i++);
    log(x, z, y, e);
}
function f4() {
    var log = console.log.bind(console),
        i = 10,
        x = (i += 2),
        y = (i += 3),
        z = (i += 4);
    log(x, z, y, i);
}
f1(), f2(), f3(), f4();
