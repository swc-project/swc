//// [foo_0.ts]
define([
    "require",
    "@swc/helpers/_/_class_call_check"
], function(require, _class_call_check) {
    return function C1() {
        _class_call_check._(this, C1);
    };
});
