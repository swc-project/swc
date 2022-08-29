import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
var Test = function Test(name) {
    "use strict";
    _class_call_check(this, Test);
    var _this = this;
    this.print = function() {
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
    }();
    this.name = name;
};
function Parent() {
    new Test("name").print("test");
}
