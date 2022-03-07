import * as swcHelpers from "@swc/helpers";
import regeneratorRuntime from "regenerator-runtime";
import * as React from "react";
var AsyncLoader = function(_Component) {
    "use strict";
    swcHelpers.inherits(AsyncLoader, _Component);
    var _super = swcHelpers.createSuper(AsyncLoader);
    function AsyncLoader() {
        return swcHelpers.classCallCheck(this, AsyncLoader), _super.apply(this, arguments);
    }
    return AsyncLoader.prototype.render = function() {
        return null;
    }, AsyncLoader;
}(React.Component);
function _load() {
    return (_load = swcHelpers.asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function(_ctx) {
            for(;;)switch(_ctx.prev = _ctx.next){
                case 0:
                    return _ctx.abrupt("return", {
                        success: !0
                    });
                case 1:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }))).apply(this, arguments);
}
React.createElement(AsyncLoader, {
    prop1: function() {
        return _load.apply(this, arguments);
    },
    prop2: function(result) {
        return result;
    }
});
