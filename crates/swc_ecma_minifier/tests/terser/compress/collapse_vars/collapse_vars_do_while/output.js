function f1(y) {
    var c = 9;
    do {} while (77 === c);
}
function f2(y) {
    var c = 5 - y;
    do {} while (c);
}
function f3(y) {
    function fn(n) {
        console.log(n);
    }
    var a = 2,
        x = 7;
    do {
        fn((a = x));
        break;
    } while (y);
}
function f4(y) {
    var a = y / 4;
    do {
        return a;
    } while (y);
}
function f5(y) {
    function p(x) {
        console.log(x);
    }
    do {
        p(y - 3);
    } while (--y);
}
