//// [file.tsx]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
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
