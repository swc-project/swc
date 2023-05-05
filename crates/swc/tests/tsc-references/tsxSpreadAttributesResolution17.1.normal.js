//// [file.tsx]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
export var Empty = /*#__PURE__*/ function(_React_Component) {
    "use strict";
    _inherits(Empty, _React_Component);
    var _super = _create_super(Empty);
    function Empty() {
        _class_call_check(this, Empty);
        return _super.apply(this, arguments);
    }
    var _proto = Empty.prototype;
    _proto.render = function render() {
        return /*#__PURE__*/ React.createElement("div", null, "Hello");
    };
    return Empty;
}(React.Component);
// OK
var unionedSpread = /*#__PURE__*/ React.createElement(Empty, obj);
