//// [genericCallWithObjectTypeArgsAndConstraints.ts]
// Generic call with constraints infering type parameter from object member properties
// No errors expected
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var X = function X() {
    _class_call_check(this, X);
};
new X(), new X();
