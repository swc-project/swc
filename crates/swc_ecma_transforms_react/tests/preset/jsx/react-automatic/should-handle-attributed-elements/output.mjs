import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
var HelloMessage = React.createClass({
    render: function () {
        return /*#__PURE__*/_jsxs("div", {
            children: ["Hello ", this.props.name]
        });
    },
    displayName: "HelloMessage",
});
React.render( /*#__PURE__*/_jsx(HelloMessage, {
    name: /*#__PURE__*/_jsx("span", {
        children: "Sebastian"
    })
}), mountNode);
