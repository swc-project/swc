import * as swcHelpers from "@swc/helpers";
//@filename: app.tsx
import * as React from "react";
export var Text = /*#__PURE__*/ function(_Component) {
    "use strict";
    swcHelpers.inherits(Text, _Component);
    var _super = swcHelpers.createSuper(Text);
    function Text() {
        swcHelpers.classCallCheck(this, Text);
        var _this;
        _this = _super.apply(this, arguments);
        _this._tagName = "div";
        return _this;
    }
    var _proto = Text.prototype;
    _proto.render = function render() {
        return /*#__PURE__*/ React.createElement(this._tagName, null);
    };
    return Text;
}(React.Component);
