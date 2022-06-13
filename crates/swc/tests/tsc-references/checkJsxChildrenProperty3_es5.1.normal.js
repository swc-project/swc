import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
// @filename: file.tsx
// @jsx: preserve
// @noLib: true
// @skipLibCheck: true
// @libFiles: react.d.ts,lib.d.ts
var React = require("react");
var FetchUser = /*#__PURE__*/ function(_Component) {
    "use strict";
    _inherits(FetchUser, _Component);
    var _super = _create_super(FetchUser);
    function FetchUser() {
        _class_call_check(this, FetchUser);
        return _super.apply(this, arguments);
    }
    var _proto = FetchUser.prototype;
    _proto.render = function render() {
        return this.state ? this.props.children(this.state.result) : null;
    };
    return FetchUser;
}(React.Component);
// Ok
function UserName0() {
    return /*#__PURE__*/ React.createElement(FetchUser, null, function(user) {
        return /*#__PURE__*/ React.createElement("h1", null, user.Name);
    });
}
function UserName1() {
    return /*#__PURE__*/ React.createElement(FetchUser, null, function(user) {
        return /*#__PURE__*/ React.createElement("h1", null, user.Name);
    });
}
export { };
