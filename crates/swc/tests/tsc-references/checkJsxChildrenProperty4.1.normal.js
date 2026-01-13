//// [file.tsx]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var FetchUser = /*#__PURE__*/ function(_React_Component) {
    "use strict";
    _inherits(FetchUser, _React_Component);
    function FetchUser() {
        _class_call_check(this, FetchUser);
        return _call_super(this, FetchUser, arguments);
    }
    var _proto = FetchUser.prototype;
    _proto.render = function render() {
        return this.state ? this.props.children(this.state.result) : null;
    };
    return FetchUser;
}(React.Component);
// Error
function UserName() {
    return /*#__PURE__*/ React.createElement(FetchUser, null, function(user) {
        return /*#__PURE__*/ React.createElement("h1", null, user.NAme);
    });
}
function UserName1() {
    return /*#__PURE__*/ React.createElement(FetchUser, null, function(user) {
        return /*#__PURE__*/ React.createElement("h1", null, user.Name);
    }, function(user) {
        return /*#__PURE__*/ React.createElement("h1", null, user.Name);
    });
}
export { };
