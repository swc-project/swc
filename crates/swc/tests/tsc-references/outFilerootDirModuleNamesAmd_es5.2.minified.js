import foo from "./b";
import Foo from "./a";
var Foo = function Foo() {
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
