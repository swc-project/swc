import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
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
        return React.createElement(this._tagName, null);
    }, Text;
}(React.Component);
