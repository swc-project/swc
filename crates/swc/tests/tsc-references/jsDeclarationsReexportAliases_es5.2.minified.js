import { default as Fooa } from "./cls";
var Foo = function() {
    "use strict";
    !function(instance, Constructor) {
        if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }(this, Foo);
};
export var x = new Fooa();
export { default as Foob } from "./cls";
export { Foo as default };
