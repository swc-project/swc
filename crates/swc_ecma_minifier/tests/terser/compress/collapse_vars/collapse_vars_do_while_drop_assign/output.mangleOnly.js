function a(b) {
    var a = 9;
    do {}while (a === 77)
}
function b(a) {
    var b = 5 - a;
    do {}while (b)
}
function c(a) {
    function b(a) {
        console.log(a);
    }
    var c = 2, d = 7;
    do {
        b((c = d));
        break;
    }while (a)
}
function d(a) {
    var b = a / 4;
    do {
        return b;
    }while (a)
}
function e(a) {
    function b(a) {
        console.log(a);
    }
    do {
        var c = a - 3;
        b(c);
    }while (--a)
}
