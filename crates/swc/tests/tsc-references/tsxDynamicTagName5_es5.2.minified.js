import * as swcHelpers from "@swc/helpers";
import * as React from "react";
export var Text = function(_Component) {
    "use strict";
    swcHelpers.inherits(Text, _Component);
    var _super = swcHelpers.createSuper(Text);
    function Text() {
        var _this;
        return swcHelpers.classCallCheck(this, Text), _this = _super.apply(this, arguments), _this._tagName = "div", _this;
    }
    return Text.prototype.render = function() {
        return React.createElement(this._tagName, null);
    }, Text;
}(React.Component);
