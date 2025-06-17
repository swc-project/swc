//// [tsxDynamicTagName7.tsx]
//// [react.d.ts]
//// [app.tsx]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import * as React from 'react';
export var Text = /*#__PURE__*/ function(_React_Component) {
    function Text() {
        var _this;
        return _class_call_check(this, Text), _this = _call_super(this, Text, arguments), _this._tagName = 'div', _this;
    }
    return _inherits(Text, _React_Component), Text.prototype.render = function() {
        return React.createElement(this, null);
    }, Text;
}(React.Component);
