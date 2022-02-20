import "./cjs4";
import "./cjs3";
import "./cjs2";
import "./cjs";
import "./bol";
import "./ban";
import "./bat";
import "./baz";
import "./bar";
import "./bar2";
export var Foo = function() {
    "use strict";
    !function(instance, Constructor) {
        if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }(this, Foo);
};
export function func() {}
export * from "./cls";
export * from "./func";
export * from "./cls";
export default ns;
var ns = require("./cls");
module.exports = {
    ns: ns
};
var ns = require("./cls");
module.exports = ns;
var ns = require("./cls");
module.exports.ns = ns;
var ns = require("./cls");
module.exports.names = ns;
export { Foo, ns, ns as classContainer };
