//// [tsxDynamicTagName7.tsx]
//// [react.d.ts]
//// [app.tsx]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
import * as React from "react";
export var Text = function(_React_Component) {
    _inherits(Text, _React_Component);
    var _super = _create_super(Text);
    function Text() {
        var _this;
        return _class_call_check(this, Text), _this = _super.apply(this, arguments), _this._tagName = "div", _this;
    }
    return Text.prototype.render = function() {
        return React.createElement(this, null);
    }, Text;
}(React.Component);
