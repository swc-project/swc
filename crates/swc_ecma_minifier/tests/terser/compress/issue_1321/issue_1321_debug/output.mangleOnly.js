var a = {};
a.foo = 1;
a["_$foo$_"] = 2 * a.foo;
console.log(a.foo, a["_$foo$_"]);
