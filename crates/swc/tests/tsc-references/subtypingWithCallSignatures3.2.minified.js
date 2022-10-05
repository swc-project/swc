//// [subtypingWithCallSignatures3.ts]
var Errors, WithGenericSignaturesInBaseType;
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
!function(Errors) {
    foo2(function(x) {
        return null;
    });
    var r2arg = function(x) {
        return function(r) {
            return null;
        };
    };
    foo7(r2arg);
    var r3arg = function(x, y) {
        return function(r) {
            return null;
        };
    };
    foo8(r3arg);
    var r4arg = function() {
        for(var _len = arguments.length, x = Array(_len), _key = 0; _key < _len; _key++)x[_key] = arguments[_key];
        return null;
    };
    foo10(r4arg);
    var r5arg = function(x, y) {
        return null;
    };
    foo11(r5arg);
    var r6arg = function(x, y) {
        return null;
    };
    foo12(r6arg);
    var r7arg = function(x) {
        return null;
    };
    foo15(r7arg);
    var r7arg3 = function(x) {
        return 1;
    };
    foo15(r7arg3);
    var r8arg = function(x) {
        return null;
    };
    foo16(r8arg);
    var r9arg = function(x) {
        return null;
    };
    foo17(r9arg);
}(Errors || (Errors = {})), function(WithGenericSignaturesInBaseType) {
    var r2arg2 = function(x) {
        return [
            ""
        ];
    };
    foo2(r2arg2);
    var r3arg2 = function(x) {
        return null;
    };
    foo3(r3arg2);
}(WithGenericSignaturesInBaseType || (WithGenericSignaturesInBaseType = {}));
