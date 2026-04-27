// Same-operator cases that should erase without error:
1 * 1 as unknown * 2;
1 / 1 as unknown / 2;
1 % 1 as unknown % 2;
1 + 1 as unknown + 2;
1 - 1 as unknown - 2;
1 << 1 as unknown << 2;
1 >> 1 as unknown >> 2;
1 >>> 1 as unknown >>> 2;
1 < 1 as unknown < 2;
1 <= 1 as unknown <= 2;
1 > 1 as unknown > 2;
1 >= 1 as unknown >= 2;
a instanceof b as unknown instanceof c;
a in b as unknown in c;
1 == 1 as unknown == 2;
1 != 1 as unknown != 2;
1 === 1 as unknown === 2;
1 !== 1 as unknown !== 2;
1 & 1 as unknown & 2;
1 ^ 1 as unknown ^ 2;
1 | 1 as unknown | 2;
1 && 1 as unknown && 2;
1 || 1 as unknown || 2;
1 ?? 1 as unknown ?? 2;

// Lower-precedence next operator should stay safe:
a << a as unknown < a;
a + a as unknown << a;
a * a as unknown + a;
a ** a as unknown * a;
a <= a as unknown == a;

// Equal-tier cross-operator cases should stay safe:
(a * b) as unknown / c;
(a % b) as unknown * c;
(a + b) as unknown - c;
(a << b) as unknown >> c;
(a >>> b) as unknown << c;
(a < b) as unknown >= c;
(a <= b) as unknown instanceof c;
(a in b) as unknown > c;
(a == b) as unknown != c;
(a === b) as unknown !== c;

// Other safe targeted cases:
1 * 1 as unknown + 2;
// 1 ?? 1 as unknown || 2; // parser error
1 * 1 as unknown /* comment */ + 2;