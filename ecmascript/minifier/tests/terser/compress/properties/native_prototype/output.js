[].splice.apply(a, [1, 2, b, c]);
(function () {}.call.apply(console.log, console, ["foo"]));
(0).toFixed.call(Math.PI, 2);
({}.hasOwnProperty.call(d, "foo"));
/t/.test.call(/foo/, "bar");
"".indexOf.call(e, "bar");
