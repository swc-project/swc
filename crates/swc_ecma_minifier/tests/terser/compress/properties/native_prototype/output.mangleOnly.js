Array.prototype.splice.apply(a, [
    1,
    2,
    b,
    c
]);
Function.prototype.call.apply(console.log, console, [
    "foo"
]);
Number.prototype.toFixed.call(Math.PI, 2);
Object.prototype.hasOwnProperty.call(d, "foo");
RegExp.prototype.test.call(/foo/, "bar");
String.prototype.indexOf.call(e, "bar");
