//// [symbolType8.ts]
var s = Symbol.for("compare");
s < s;
s < 0;
s > s;
s > 0;
s <= s;
s <= 0;
s >= s;
s >= 0;
0 >= (s || 0);
(s || 0) >= s;
