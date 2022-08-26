import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
import * as React from "react";
export var Text = function(_Component) {
    "use strict";
    _inherits(Text, _Component);
    var _super = _create_super(Text);
    function Text() {
        var _this;
        return _class_call_check(this, Text), _this = _super.apply(this, arguments), _this._tagName = "div", _this;
    }
    return Text.prototype.render = function() {
        return React.createElement(this, null);
    }, Text;
}(React.Component);
