// should be a syntax error
(a !== null && a !== void 0 ? a : b) || c;
var // should be a syntax error
ref;
(ref = a || b) !== null && ref !== void 0 ? ref : c;
// should be a syntax error
a !== null && a !== void 0 ? a : b && c;
var // should be a syntax error
ref1;
(ref1 = a && b) !== null && ref1 !== void 0 ? ref1 : c;
// Valid according to spec
a !== null && a !== void 0 ? a : b || c;
// Valid according to spec
(a !== null && a !== void 0 ? a : b) || c;
var // Valid according to spec
ref2;
(ref2 = (a || b)) !== null && ref2 !== void 0 ? ref2 : c;
// Valid according to spec
a || (b !== null && b !== void 0 ? b : c);
// Valid according to spec
a !== null && a !== void 0 ? a : b && c;
// Valid according to spec
(a !== null && a !== void 0 ? a : b) && c;
var // Valid according to spec
ref3;
(ref3 = (a && b)) !== null && ref3 !== void 0 ? ref3 : c;
// Valid according to spec
a && (b !== null && b !== void 0 ? b : c);
