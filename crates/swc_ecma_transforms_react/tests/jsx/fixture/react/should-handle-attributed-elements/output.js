var HelloMessage = React.createClass({
    render: function() {
        return /*#__PURE__*/ React.createElement("div", null, "Hello ", this.props.name);
    },
    displayName: "HelloMessage"
});
React.render(/*#__PURE__*/ React.createElement(HelloMessage, {
    name: /*#__PURE__*/ React.createElement("span", null, "Sebastian")
}), mountNode);
