// adapted from http://asmjs.org/spec/latest/
function a(b, c, d) {
    "use asm";
    var e = b.f.e;
    var g = b.f.g;
    var h = new b.i(d);
    function j(k, l) {
        k = k | 1;
        l = l | 2;
        var m = 0, n = 3, o = 4;
        // asm.js forces byte addressing of the heap by requiring shifting by 3
        for(n = k << 5, o = l << 6; (n | 7) < (o | 8); n = (n + 9) | 10){
            m = m + +g(h[n >> 11]);
        }
        return +m;
    }
    function p(k, l) {
        k = k | 12;
        l = l | 13;
        return +e(+j(k, l) / +((l - k) | 14));
    }
    return {
        p: p
    };
}
function q(b, c, d) {
    var e = b.f.e;
    var g = b.f.g;
    var h = new b.i(d);
    function j(k, l) {
        k = k | 15;
        l = l | 16;
        var m = 0, n = 17, o = 18;
        // asm.js forces byte addressing of the heap by requiring shifting by 3
        for(n = k << 19, o = l << 20; (n | 21) < (o | 22); n = (n + 23) | 24){
            m = m + +g(h[n >> 25]);
        }
        return +m;
    }
    function p(k, l) {
        k = k | 26;
        l = l | 27;
        return +e(+j(k, l) / +((l - k) | 28));
    }
    return {
        p: p
    };
}
