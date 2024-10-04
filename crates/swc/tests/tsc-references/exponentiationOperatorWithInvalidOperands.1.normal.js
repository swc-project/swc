//// [exponentiationOperatorWithInvalidOperands.ts]
// these operators require their operands to be of type Any, the Number primitive type, or
// an enum type
var E = /*#__PURE__*/ function(E) {
    E[E["a"] = 0] = "a";
    E[E["b"] = 1] = "b";
    E[E["c"] = 2] = "c";
    return E;
}(E || {});
var a;
var b;
var c;
var d;
var e;
var f;
// All of the below should be an error unless otherwise noted
// operator **
var r1a1 = Math.pow(a, a); //ok
var r1a2 = Math.pow(a, b);
var r1a3 = Math.pow(a, c); //ok
var r1a4 = Math.pow(a, d);
var r1a5 = Math.pow(a, e);
var r1a6 = Math.pow(a, f);
var r1b1 = Math.pow(b, a);
var r1b2 = Math.pow(b, b);
var r1b3 = Math.pow(b, c);
var r1b4 = Math.pow(b, d);
var r1b5 = Math.pow(b, e);
var r1b6 = Math.pow(b, f);
var r1c1 = Math.pow(c, a); //ok
var r1c2 = Math.pow(c, b);
var r1c3 = Math.pow(c, c); //ok
var r1c4 = Math.pow(c, d);
var r1c5 = Math.pow(c, e);
var r1c6 = Math.pow(c, f);
var r1d1 = Math.pow(d, a);
var r1d2 = Math.pow(d, b);
var r1d3 = Math.pow(d, c);
var r1d4 = Math.pow(d, d);
var r1d5 = Math.pow(d, e);
var r1d6 = Math.pow(d, f);
var r1e1 = Math.pow(e, a);
var r1e2 = Math.pow(e, b);
var r1e3 = Math.pow(e, c);
var r1e4 = Math.pow(e, d);
var r1e5 = Math.pow(e, e);
var r1e6 = Math.pow(e, f);
var r1f1 = Math.pow(f, a);
var r1f2 = Math.pow(f, b);
var r1f3 = Math.pow(f, c);
var r1f4 = Math.pow(f, d);
var r1f5 = Math.pow(f, e);
var r1f6 = Math.pow(f, f);
var r1g1 = Math.pow(0, a); //ok
var r1g2 = Math.pow(0, b);
var r1g3 = Math.pow(0, c); //ok
var r1g4 = Math.pow(0, d);
var r1g5 = Math.pow(0, e);
var r1g6 = Math.pow(0, f);
var r1h1 = Math.pow(a, 1); //ok
var r1h2 = Math.pow(b, 1);
var r1h3 = Math.pow(c, 1); //ok
var r1h4 = Math.pow(d, 1);
var r1h5 = Math.pow(e, 1);
var r1h6 = Math.pow(f, 1);
