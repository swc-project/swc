import * as swcHelpers from "@swc/helpers";
// @filename: file.tsx
// @jsx: preserve
// @noLib: true
// @skipLibCheck: true
// @libFiles: react.d.ts,lib.d.ts
var React = require('react');
var FetchUser = /*#__PURE__*/ function(_Component) {
    "use strict";
    swcHelpers.inherits(FetchUser, _Component);
    var _super = swcHelpers.createSuper(FetchUser);
    function FetchUser() {
        swcHelpers.classCallCheck(this, FetchUser);
        return _super.apply(this, arguments);
    }
    swcHelpers.createClass(FetchUser, [
        {
            key: "render",
            value: function render() {
                return this.state ? this.props.children(this.state.result) : null;
            }
        }
    ]);
    return FetchUser;
}(React.Component);
// Error
function UserName() {
    return(/*#__PURE__*/ React.createElement(FetchUser, null, function(user) {
        /*#__PURE__*/ return React.createElement("h1", null, user.NAme);
    }));
}
function UserName1() {
    return(/*#__PURE__*/ React.createElement(FetchUser, null, function(user) {
        /*#__PURE__*/ return React.createElement("h1", null, user.Name);
    }, function(user) {
        /*#__PURE__*/ return React.createElement("h1", null, user.Name);
    }));
}
export { };
