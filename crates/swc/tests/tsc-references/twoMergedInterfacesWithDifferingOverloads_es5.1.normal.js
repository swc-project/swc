// interfaces that merge must not have members that conflict
var b;
var r = b.foo(true); // returns Date
var c;
var r2 = c.foo(1, 2); // number
var d;
var r3 = d.foo(1, 1); // boolean, last definition wins
