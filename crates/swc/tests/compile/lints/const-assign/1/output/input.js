var a = 100, b = 200, c = {
    c: 300
}.c, _ref = [], tmp = _ref[0], d = tmp === void 0 ? 400 : tmp;
a = 200;
b++;
c--;
++d;
--a;
b += 10;
c -= 10;
d *= 10;
a /= 10;
b %= 10;
c <<= 10;
d >>= 10;
a >>>= 10;
b |= 10;
c ^= 10;
d &= 10;
a = Math.pow(a, 10);
b && (b = 10);
c || (c = 10);
d !== null && d !== void 0 ? d : d = 10;
var fn = function fn() {
    var e = 100;
    e = 200;
};
