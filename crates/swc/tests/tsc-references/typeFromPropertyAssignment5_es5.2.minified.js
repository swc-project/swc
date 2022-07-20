import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
export default function MyClass() {};
MyClass.bar = function C() {
    "use strict";
    _class_call_check(this, C);
}, MyClass.bar;
import MC from "./a";
MC.bar;
