// @strict: true
let { a: a1  } = x;
let { a: a2 = 0  } = x;
let { a: a3 = 2  } = x;
let { a: a4 = 2  } = x;
let b1 = x.a;
var _a;
let b2 = (_a = x.a) !== null && _a !== void 0 ? _a : 0;
var _a1;
let b3 = (_a1 = x.a) !== null && _a1 !== void 0 ? _a1 : 2;
var _a2;
let b4 = (_a2 = x.a) !== null && _a2 !== void 0 ? _a2 : 2;
let { bar ='yo'  } = {};
bar; // "yo" | "ha"
