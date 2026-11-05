var _class_call_check = require("@swc/helpers/_/_class_call_check");
var _define_property = require("@swc/helpers/_/_define_property");
var _ts_decorate = require("@swc/helpers/_/_ts_decorate");
new A();
var C = function C() {
    "use strict";
    _class_call_check._(this, C);
    _define_property._(this, "prop", new A());
    _define_property._(this, "prop2", function() {
        new A();
    });
};
C = _ts_decorate._([
    Decorator(function() {
        new A();
    })
], C);
