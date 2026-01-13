//// [file.tsx]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
export function makeP(Ctor) {
    return /*#__PURE__*/ function(_React_PureComponent) {
        "use strict";
        _inherits(_class, _React_PureComponent);
        function _class() {
            _class_call_check(this, _class);
            return _call_super(this, _class, arguments);
        }
        var _proto = _class.prototype;
        _proto.render = function render() {
            return /*#__PURE__*/ React.createElement(Ctor, this.props);
        };
        return _class;
    }(React.PureComponent);
}
