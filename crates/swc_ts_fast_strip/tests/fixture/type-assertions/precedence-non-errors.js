let a    , b    , c    ;
             

// Operator is a TypeScript type operator
a & b           ;
//    ^^^^^^^^^^
a | b               ;
//    ^^^^^^^^^^^^^^

// Same-operator cases that should erase without error:
1 * 1           * 2;
1 / 1           / 2;
1 % 1           % 2;
1 + 1           + 2;
1 - 1           - 2;
1 << 1           << 2;
1 >> 1           >> 2;
1 >>> 1           >>> 2;
1 < 1        < 2;
1 <= 1        <= 2;
1 > 1        > 2;
1 >= 1        >= 2;
a instanceof b            instanceof c;
a in b        in c;
a == b           == c;
a != b            != c;
a === b            === c;
a !== b            !== c;
a ^ b        ^ c;
a && 1            && c;
a && b            || c;
a || b            || c;
a || b            && c;
a ?? b            ?? c;

// Lower-precedence next operator should stay safe:
a << a        < a;
a + a        << a;
a * a        + a;
a ** a        * a;
a <= a        == a;

// Equal-tier cross-operator cases should stay safe:
(a * b)        / c;
(a % b)        * c;
(a + b)        - c;
(a << b)        >> c;
(a >>> b)        << c;
(a < b)        >= c;
(a <= b)            instanceof c;
(a in b)        > c;
(a == b)            != c;
(a === b)            !== c;

// Comments do not interfere with safe erasure detection:
1 * 1        /* comment */ + 2;

a + (b         ) * c;
a + (b           ) * c;
a + (b                  ) * c;
a || b                   && c;
