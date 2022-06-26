import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import foo from "./b";
import Foo from "./a";
var Foo = function Foo() {
    "use strict";
    _class_call_check(this, Foo);
};
foo();
export default function foo() {
    new Foo();
};
import("./a");
export { Foo as default };
