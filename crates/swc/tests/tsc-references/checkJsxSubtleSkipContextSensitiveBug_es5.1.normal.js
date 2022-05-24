import _async_to_generator from "@swc/helpers/lib/_async_to_generator.js";
import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
import regeneratorRuntime from "regenerator-runtime";
// @strict: true
// @jsx: react
// @lib: es6
// @skipLibCheck: true
/// <reference path="/.lib/react16.d.ts" />
import * as React from "react";
var AsyncLoader = /*#__PURE__*/ function(_Component) {
    "use strict";
    _inherits(AsyncLoader, _Component);
    var _super = _create_super(AsyncLoader);
    function AsyncLoader() {
        _class_call_check(this, AsyncLoader);
        return _super.apply(this, arguments);
    }
    var _proto = AsyncLoader.prototype;
    _proto.render = function render() {
        return null;
    };
    return AsyncLoader;
}(React.Component);
function load() {
    return _load.apply(this, arguments);
}
function _load() {
    _load = _async_to_generator(regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    return _ctx.abrupt("return", {
                        success: true
                    });
                case 1:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }));
    return _load.apply(this, arguments);
}
var loader = /*#__PURE__*/ React.createElement(AsyncLoader, {
    prop1: load,
    prop2: function(result) {
        return result;
    }
});
