import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _define_property } from "@swc/helpers/_/_define_property";
import { _ as _ts_generator } from "@swc/helpers/_/_ts_generator";
var Test = function Test(name) {
    "use strict";
    var _this = this;
    _class_call_check(this, Test);
    _define_property(this, "print", function(arg) {
        return _async_to_generator(function() {
            return _ts_generator(this, function(_state) {
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
