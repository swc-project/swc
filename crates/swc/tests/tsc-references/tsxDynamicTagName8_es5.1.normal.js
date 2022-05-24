import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
//@filename: app.tsx
import * as React from "react";
export var Text = /*#__PURE__*/ function(_Component) {
    "use strict";
    _inherits(Text, _Component);
    var _super = _create_super(Text);
    function Text() {
        _class_call_check(this, Text);
        var _this;
        _this = _super.apply(this, arguments);
        _this._tagName = "div";
        return _this;
    }
    var _proto = Text.prototype;
    _proto.render = function render() {
        return /*#__PURE__*/ React.createElement(this._tagName, null, " Hello world ");
    };
    return Text;
}(React.Component);
