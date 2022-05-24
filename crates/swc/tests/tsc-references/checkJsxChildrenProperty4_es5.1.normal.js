import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
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
