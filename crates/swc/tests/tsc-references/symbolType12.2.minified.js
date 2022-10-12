//// [symbolType12.ts]
var s = Symbol.for("assign"), str = "";
str += s = (s = 0 / 0 % 0) + 0 + "", s = 0, str += s || str;
