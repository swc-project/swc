let a:any, b:any, c:any;
type T = any;

// Operator is a TypeScript type operator
a & b as any & T;
//    ^^^^^^^^^^
a | b as unknown | T;
//    ^^^^^^^^^^^^^^

// Same-operator cases that should erase without error:
1 * 1 as number * 2;
1 / 1 as number / 2;
1 % 1 as number % 2;
1 + 1 as number + 2;
1 - 1 as number - 2;
1 << 1 as number << 2;
1 >> 1 as number >> 2;
1 >>> 1 as number >>> 2;
1 < 1 as any < 2;
1 <= 1 as any <= 2;
1 > 1 as any > 2;
1 >= 1 as any >= 2;
a instanceof b as unknown instanceof c;
a in b as any in c;
a == b as number == c;
a != b as unknown != c;
a === b as unknown === c;
a !== b as unknown !== c;
a ^ b as any ^ c;
a && 1 as unknown && c;
a && b as unknown || c;
a || b as unknown || c;
a || b as unknown && c;
a ?? b as unknown ?? c;

// Lower-precedence next operator should stay safe:
a << a as any < a;
a + a as any << a;
a * a as any + a;
a ** a as any * a;
a <= a as any == a;

// Equal-tier cross-operator cases should stay safe:
(a * b) as any / c;
(a % b) as any * c;
(a + b) as any - c;
(a << b) as any >> c;
(a >>> b) as any << c;
(a < b) as any >= c;
(a <= b) as unknown instanceof c;
(a in b) as any > c;
(a == b) as unknown != c;
(a === b) as unknown !== c;

// Comments do not interfere with safe erasure detection:
1 * 1 as any /* comment */ + 2;

a + (b as const) * c;
a + (b as unknown) * c;
a + (b satisfies unknown) * c;
a || b satisfies unknown && c;
