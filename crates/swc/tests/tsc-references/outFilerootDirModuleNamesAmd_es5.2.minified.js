import foo from "./b";
var Foo = function() {
    "use strict";
    !function(instance, Constructor) {
        if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }(this, Foo);
};
foo();
export default function foo() {
    new Foo();
};
import("./a");
export { Foo as default };
