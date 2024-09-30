//// [comparisonOperatorWithSubtypeEnumAndNumber.ts]
var E = /*#__PURE__*/ function(E) {
    E[E["a"] = 0] = "a";
    E[E["b"] = 1] = "b";
    E[E["c"] = 2] = "c";
    return E;
}(E || {});
var a;
var b;
// operator <
var ra1 = a < b;
var ra2 = b < a;
var ra3 = 0 < b;
var ra4 = b < 0;
var ra5 = 0 < 0;
var ra6 = 0 < 0;
// operator >
var rb1 = a > b;
var rb2 = b > a;
var rb3 = 0 > b;
var rb4 = b > 0;
var rb5 = 0 > 0;
var rb6 = 0 > 0;
// operator <=
var rc1 = a <= b;
var rc2 = b <= a;
var rc3 = 0 <= b;
var rc4 = b <= 0;
var rc5 = 0 <= 0;
var rc6 = 0 <= 0;
// operator >=
var rd1 = a >= b;
var rd2 = b >= a;
var rd3 = 0 >= b;
var rd4 = b >= 0;
var rd5 = 0 >= 0;
var rd6 = 0 >= 0;
// operator ==
var re1 = a == b;
var re2 = b == a;
var re3 = 0 == b;
var re4 = b == 0;
var re5 = 0 == 0;
var re6 = 0 == 0;
// operator !=
var rf1 = a != b;
var rf2 = b != a;
var rf3 = 0 != b;
var rf4 = b != 0;
var rf5 = 0 != 0;
var rf6 = 0 != 0;
// operator ===
var rg1 = a === b;
var rg2 = b === a;
var rg3 = 0 === b;
var rg4 = b === 0;
var rg5 = 0 === 0;
var rg6 = 0 === 0;
// operator !==
var rh1 = a !== b;
var rh2 = b !== a;
var rh3 = 0 !== b;
var rh4 = b !== 0;
var rh5 = 0 !== 0;
var rh6 = 0 !== 0;
