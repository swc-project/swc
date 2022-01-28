var x = {};
x.foo = 1;
x["_$foo$_"] = 2 * x.foo;
console.log(x.foo, x["_$foo$_"]);
