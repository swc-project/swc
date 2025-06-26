var _async_to_generator = require("@swc/helpers/_/_async_to_generator");
var _class_call_check = require("@swc/helpers/_/_class_call_check");
var _define_property = require("@swc/helpers/_/_define_property");
var _ts_generator = require("@swc/helpers/_/_ts_generator");
var Test = function Test(name) {
    "use strict";
    var _this = this;
    _class_call_check._(this, Test);
    _define_property._(this, "print", function(arg) {
        return _async_to_generator._(function() {
            return _ts_generator._(this, function(_state) {
                console.log(this.name, arg);
                return [
                    2
                ];
            });
        }).call(_this);
    });
    this.name = name;
};
function Parent() {
    new Test("name").print("test");
}
