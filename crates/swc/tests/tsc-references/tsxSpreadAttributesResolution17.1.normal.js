//// [file.tsx]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
export var Empty = /*#__PURE__*/ function(_React_Component) {
    "use strict";
    _inherits(Empty, _React_Component);
    function Empty() {
        _class_call_check(this, Empty);
        return _call_super(this, Empty, arguments);
    }
    var _proto = Empty.prototype;
    _proto.render = function render() {
        return /*#__PURE__*/ React.createElement("div", null, "Hello");
    };
    return Empty;
}(React.Component);
// OK
var unionedSpread = /*#__PURE__*/ React.createElement(Empty, obj);
