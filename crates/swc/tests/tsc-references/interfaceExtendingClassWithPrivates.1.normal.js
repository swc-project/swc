//// [interfaceExtendingClassWithPrivates.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var Foo = function Foo() {
    "use strict";
    _class_call_check(this, Foo);
};
var i;
var r = i.y;
var r2 = i.x; // error
