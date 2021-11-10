var E1;
(function(E) {
    E[E["a"] = 0] = "a";
    E[E["b"] = 1] = "b";
    E[E["c"] = 2] = "c";
})(E1 || (E1 = {
}));
var a;
var b;
// operator <
var ra1 = a < b;
var ra2 = b < a;
var ra3 = E1.a < b;
var ra4 = b < E1.a;
var ra5 = E1.a < 0;
var ra6 = 0 < E1.a;
// operator >
var rb1 = a > b;
var rb2 = b > a;
var rb3 = E1.a > b;
var rb4 = b > E1.a;
var rb5 = E1.a > 0;
var rb6 = 0 > E1.a;
// operator <=
var rc1 = a <= b;
var rc2 = b <= a;
var rc3 = E1.a <= b;
var rc4 = b <= E1.a;
var rc5 = E1.a <= 0;
var rc6 = 0 <= E1.a;
// operator >=
var rd1 = a >= b;
var rd2 = b >= a;
var rd3 = E1.a >= b;
var rd4 = b >= E1.a;
var rd5 = E1.a >= 0;
var rd6 = 0 >= E1.a;
// operator ==
var re1 = a == b;
var re2 = b == a;
var re3 = E1.a == b;
var re4 = b == E1.a;
var re5 = E1.a == 0;
var re6 = 0 == E1.a;
// operator !=
var rf1 = a != b;
var rf2 = b != a;
var rf3 = E1.a != b;
var rf4 = b != E1.a;
var rf5 = E1.a != 0;
var rf6 = 0 != E1.a;
// operator ===
var rg1 = a === b;
var rg2 = b === a;
var rg3 = E1.a === b;
var rg4 = b === E1.a;
var rg5 = E1.a === 0;
var rg6 = 0 === E1.a;
// operator !==
var rh1 = a !== b;
var rh2 = b !== a;
var rh3 = E1.a !== b;
var rh4 = b !== E1.a;
var rh5 = E1.a !== 0;
var rh6 = 0 !== E1.a;
