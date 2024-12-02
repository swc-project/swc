//// [file.tsx]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
export var Empty = /*#__PURE__*/ function(_React_Component) {
    function Empty() {
        return _class_call_check(this, Empty), _call_super(this, Empty, arguments);
    }
    return _inherits(Empty, _React_Component), Empty.prototype.render = function() {
        return React.createElement("div", null, "Hello");
    }, Empty;
}(React.Component);
obj;
