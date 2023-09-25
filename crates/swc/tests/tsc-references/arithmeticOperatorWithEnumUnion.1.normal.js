//// [arithmeticOperatorWithEnumUnion.ts]
// operands of an enum type are treated as having the primitive type Number.
var E;
(function(E) {
    E[E["a"] = 0] = "a";
    E[E["b"] = 1] = "b";
})(E || (E = {}));
var F;
(function(F) {
    F[F["c"] = 0] = "c";
    F[F["d"] = 1] = "d";
})(F || (F = {}));
var a;
var b;
var c;
// operator *
var ra1 = c * a;
var ra2 = c * b;
var ra3 = c * c;
var ra4 = a * c;
var ra5 = b * c;
var ra6 = 0 * a;
var ra7 = 0 * b;
var ra8 = 0 * 1;
var ra9 = 0 * 1;
var ra10 = a * 1;
var ra11 = b * 1;
var ra12 = 1 * 1;
// operator /
var rb1 = c / a;
var rb2 = c / b;
var rb3 = c / c;
var rb4 = a / c;
var rb5 = b / c;
var rb6 = 0 / a;
var rb7 = 0 / b;
var rb8 = 0 / 1;
var rb9 = 0 / 1;
var rb10 = a / 1;
var rb11 = b / 1;
var rb12 = 1 / 1;
// operator %
var rc1 = c % a;
var rc2 = c % b;
var rc3 = c % c;
var rc4 = a % c;
var rc5 = b % c;
var rc6 = 0 % a;
var rc7 = 0 % b;
var rc8 = 0 % 1;
var rc9 = 0 % 1;
var rc10 = a % 1;
var rc11 = b % 1;
var rc12 = 1 % 1;
// operator -
var rd1 = c - a;
var rd2 = c - b;
var rd3 = c - c;
var rd4 = a - c;
var rd5 = b - c;
var rd6 = 0 - a;
var rd7 = 0 - b;
var rd8 = 0 - 1;
var rd9 = 0 - 1;
var rd10 = a - 1;
var rd11 = b - 1;
var rd12 = 1 - 1;
// operator <<
var re1 = c << a;
var re2 = c << b;
var re3 = c << c;
var re4 = a << c;
var re5 = b << c;
var re6 = 0 << a;
var re7 = 0 << b;
var re8 = 0 << 1;
var re9 = 0 << 1;
var re10 = a << 1;
var re11 = b << 1;
var re12 = 1 << 1;
// operator >>
var rf1 = c >> a;
var rf2 = c >> b;
var rf3 = c >> c;
var rf4 = a >> c;
var rf5 = b >> c;
var rf6 = 0 >> a;
var rf7 = 0 >> b;
var rf8 = 0 >> 1;
var rf9 = 0 >> 1;
var rf10 = a >> 1;
var rf11 = b >> 1;
var rf12 = 1 >> 1;
// operator >>>
var rg1 = c >>> a;
var rg2 = c >>> b;
var rg3 = c >>> c;
var rg4 = a >>> c;
var rg5 = b >>> c;
var rg6 = 0 >>> a;
var rg7 = 0 >>> b;
var rg8 = 0 >>> 1;
var rg9 = 0 >>> 1;
var rg10 = a >>> 1;
var rg11 = b >>> 1;
var rg12 = 1 >>> 1;
// operator &
var rh1 = c & a;
var rh2 = c & b;
var rh3 = c & c;
var rh4 = a & c;
var rh5 = b & c;
var rh6 = 0 & a;
var rh7 = 0 & b;
var rh8 = 0 & 1;
var rh9 = 0 & 1;
var rh10 = a & 1;
var rh11 = b & 1;
var rh12 = 1 & 1;
// operator ^
var ri1 = c ^ a;
var ri2 = c ^ b;
var ri3 = c ^ c;
var ri4 = a ^ c;
var ri5 = b ^ c;
var ri6 = 0 ^ a;
var ri7 = 0 ^ b;
var ri8 = 0 ^ 1;
var ri9 = 0 ^ 1;
var ri10 = a ^ 1;
var ri11 = b ^ 1;
var ri12 = 1 ^ 1;
// operator |
var rj1 = c | a;
var rj2 = c | b;
var rj3 = c | c;
var rj4 = a | c;
var rj5 = b | c;
var rj6 = 0 | a;
var rj7 = 0 | b;
var rj8 = 0 | 1;
var rj9 = 0 | 1;
var rj10 = a | 1;
var rj11 = b | 1;
var rj12 = 1 | 1;
