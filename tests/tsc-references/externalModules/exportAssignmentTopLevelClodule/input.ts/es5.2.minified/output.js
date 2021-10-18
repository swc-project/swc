var Foo = function() {
    "use strict";
    !function(instance, Constructor) {
        if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }(this, Foo), this.test = "test";
};
(Foo || (Foo = {
})).answer = 42, module.exports = Foo;
var foo = require("./foo_0");
42 === foo.answer && new foo();
export { };
