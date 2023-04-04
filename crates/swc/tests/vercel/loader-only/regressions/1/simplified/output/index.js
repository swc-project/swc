import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _define_property } from "@swc/helpers/_/_define_property";
import { _ as _ts_generator } from "@swc/helpers/_/_ts_generator";
var Test = function Test(name) {
    "use strict";
    _class_call_check(this, Test);
    var _this = this;
    _define_property(this, "print", function() {
        var _ref = _async_to_generator(function(arg) {
            return _ts_generator(this, function(_state) {
                console.log(_this.name, arg);
                return [
                    2
                ];
            });
        });
        return function(arg) {
            return _ref.apply(this, arguments);
        };
    }());
    this.name = name;
};
function Parent() {
    new Test("name").print("test");
}
