//// [file.tsx]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
export function makeP(Ctor) {
    function _class() {
        return _class_call_check(this, _class), _call_super(this, _class, arguments);
    }
    return _inherits(_class, React.PureComponent), _class.prototype.render = function() {
        return React.createElement(Ctor, this.props);
    }, _class;
}
