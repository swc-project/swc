// Same-operator cases that should erase without error:
1 * 1            * 2;
1 / 1            / 2;
1 % 1            % 2;
1 + 1            + 2;
1 - 1            - 2;
1 << 1            << 2;
1 >> 1            >> 2;
1 >>> 1            >>> 2;
1 < 1            < 2;
1 <= 1            <= 2;
1 > 1            > 2;
1 >= 1            >= 2;
a instanceof b            instanceof c;
a in b            in c;
1 == 1            == 2;
1 != 1            != 2;
1 === 1            === 2;
1 !== 1            !== 2;
1 & 1               ;
1 ^ 1            ^ 2;
1 | 1               ;
1 && 1            && 2;
1 || 1            || 2;
1 ?? 1            ?? 2;

// Lower-precedence next operator should stay safe:
a << a            < a;
a + a            << a;
a * a            + a;
a ** a            * a;
a <= a            == a;

// Equal-tier cross-operator cases should stay safe:
(a * b)            / c;
(a % b)            * c;
(a + b)            - c;
(a << b)            >> c;
(a >>> b)            << c;
(a < b)            >= c;
(a <= b)            instanceof c;
(a in b)            > c;
(a == b)            != c;
(a === b)            !== c;

// Other safe targeted cases:
1 * 1            + 2;
// 1 ?? 1 as unknown || 2; // parser error
1 * 1            /* comment */ + 2;