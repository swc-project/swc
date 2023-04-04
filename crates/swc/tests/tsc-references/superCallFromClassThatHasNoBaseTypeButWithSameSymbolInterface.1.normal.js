//// [superCallFromClassThatHasNoBaseTypeButWithSameSymbolInterface.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var Foo = function Foo() {
    "use strict";
    _class_call_check(this, Foo);
    super(); // error
};
