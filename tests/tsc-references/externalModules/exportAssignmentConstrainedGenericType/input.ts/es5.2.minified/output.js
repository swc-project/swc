var Foo = function(x) {
    "use strict";
    !function(instance, Constructor) {
        if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }(this, Foo);
};
module.exports = Foo;
var foo = require("./foo_0");
new foo(!0), new foo({
    a: "test",
    b: 42
}).test.b;
export { };
