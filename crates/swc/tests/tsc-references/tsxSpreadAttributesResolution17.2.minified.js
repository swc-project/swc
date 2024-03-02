//// [file.tsx]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
export var Empty = function(_React_Component) {
    _inherits(Empty, _React_Component);
    var _super = _create_super(Empty);
    function Empty() {
        return _class_call_check(this, Empty), _super.apply(this, arguments);
    }
    return Empty.prototype.render = function() {
        return React.createElement("div", null, "Hello");
    }, Empty;
}(React.Component);
obj;
