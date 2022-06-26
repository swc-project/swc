import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
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
        return /*#__PURE__*/ React.createElement(this._tagName, null);
    };
    return Text;
}(React.Component);
