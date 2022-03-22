import * as swcHelpers from "@swc/helpers";
// @filename: file.tsx
// @jsx: preserve
// @noLib: true
// @skipLibCheck: true
// @libFiles: react.d.ts,lib.d.ts
var React = require("react");
var FetchUser = /*#__PURE__*/ function(_Component) {
    "use strict";
    swcHelpers.inherits(FetchUser, _Component);
    var _super = swcHelpers.createSuper(FetchUser);
    function FetchUser() {
        swcHelpers.classCallCheck(this, FetchUser);
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
