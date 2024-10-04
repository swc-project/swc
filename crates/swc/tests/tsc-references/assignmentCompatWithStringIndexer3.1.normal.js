//// [assignmentCompatWithStringIndexer3.ts]
// Derived type indexer must be subtype of base type indexer
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var a;
var b1;
a = b1; // error
b1 = a; // error
(function(Generics) {
    var A = function A() {
        "use strict";
        _class_call_check(this, A);
    };
    function foo() {
        var a;
        var b;
        a = b; // error
        b = a; // error
    }
})(Generics || (Generics = {}));
var Generics;
