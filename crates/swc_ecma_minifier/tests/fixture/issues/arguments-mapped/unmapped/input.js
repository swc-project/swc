(function (a) {
    var a = 3;
    console.log(a, arguments[0]);
})();

(function (a) {
    var a = 3;
    console.log(a, arguments[0]);
})(...[]);

(function (a, a) {
    var a;
    a++;
    console.log(a, arguments[0], arguments[1]);
})(4, 5);

(function (a, b) {
    "use strict";
    var c = arguments[0];
    var d = arguments[1];
    var a = "foo";
    b++;
    arguments[0] = "moo";
    arguments[1] *= 2;
    console.log(a, b, c, d, arguments[0], arguments[1]);
})("bar", 42);

(function (a) {
    var a;
    delete arguments[0];
    a = 8;
    console.log(a, arguments[0]);
})(1);

(function (a) {
    var a;
    var object = arguments;
    Object.defineProperty(object, "0", { value: 7, writable: false });
    a = 8;
    console.log(a, arguments[0]);
})(1);

(function (a) {
    var a;
    (() => delete arguments[0])();
    a = 8;
    console.log(a, arguments[0]);
})(1);

(function (a) {
    var a;
    console.log(arguments[0]());
})(function f() {
    return this[0] === f;
});
