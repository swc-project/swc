//// [symbolType6.ts]
var s = Symbol.for("add");
var a;
s + s;
s - s;
s + "";
s + a;
s + 0;
"" + s;
a + s;
0 + s;
s - 0;
0 - s;
(s || "") + "";
"" + (s || "");
