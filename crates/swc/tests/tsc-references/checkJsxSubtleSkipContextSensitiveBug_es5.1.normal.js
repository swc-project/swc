import * as swcHelpers from "@swc/helpers";
import regeneratorRuntime from "regenerator-runtime";
// @strict: true
// @jsx: react
// @lib: es6
// @skipLibCheck: true
/// <reference path="/.lib/react16.d.ts" />
import * as React from "react";
var AsyncLoader = /*#__PURE__*/ function(_Component) {
    "use strict";
    swcHelpers.inherits(AsyncLoader, _Component);
    var _super = swcHelpers.createSuper(AsyncLoader);
    function AsyncLoader() {
        swcHelpers.classCallCheck(this, AsyncLoader);
        return _super.apply(this, arguments);
    }
    swcHelpers.createClass(AsyncLoader, [
        {
            key: "render",
            value: function render() {
                return null;
            }
        }
    ]);
    return AsyncLoader;
}(React.Component);
function load() {
    return _load.apply(this, arguments);
}
function _load() {
    _load = swcHelpers.asyncToGenerator(regeneratorRuntime.mark(function _callee() {
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
