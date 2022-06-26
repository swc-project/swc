import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import regeneratorRuntime from "regenerator-runtime";
import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect } from "react";
var Test = function Test(name) {
    "use strict";
    _class_call_check(this, Test);
    var _this = this;
    this.print = function() {
        var _ref = _async_to_generator(regeneratorRuntime.mark(function _callee(arg) {
            return regeneratorRuntime.wrap(function _callee$(_ctx) {
                while(1)switch(_ctx.prev = _ctx.next){
                    case 0:
                        console.log(_this.name, arg);
                    case 1:
                    case "end":
                        return _ctx.stop();
                }
            }, _callee);
        }));
        return function(arg) {
            return _ref.apply(this, arguments);
        };
    }();
    this.name = name;
};
export default function Parent() {
    useEffect(function() {
        new Test("name").print("test");
    }, []);
    return /*#__PURE__*/ _jsx(_Fragment, {});
};
