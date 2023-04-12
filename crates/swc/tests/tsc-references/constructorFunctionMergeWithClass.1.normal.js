//// [constructorFunctionMergeWithClass.ts]
//// [file1.js]
var SomeClass = function SomeClass() {
    this.otherProp = 0;
};
new SomeClass();
//// [file2.js]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var SomeClass = function SomeClass() {
    "use strict";
    _class_call_check(this, SomeClass);
};
SomeClass.prop = 0;
