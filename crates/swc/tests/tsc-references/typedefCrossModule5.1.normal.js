//// [mod1.js]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
/** @typedef {number} Foo */ var Bar = function Bar() {
    "use strict";
    _class_call_check(this, Bar);
};
//// [mod2.js]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var Foo = function Foo() {
    "use strict";
    _class_call_check(this, Foo);
} // should error
;
var Bar = 3;
