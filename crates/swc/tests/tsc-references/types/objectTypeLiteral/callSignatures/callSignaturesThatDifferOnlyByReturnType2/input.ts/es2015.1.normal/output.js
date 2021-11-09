var x;
// BUG 822524
var r = x.foo(1); // no error
var r2 = x.foo(''); // error
