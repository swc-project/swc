var HelloMessage = React.createClass({
    render: function() {
        return React.createElement("div", null, "Hello ", this.props.name);
    },
    displayName: "HelloMessage"
});
React.render(React.createElement(HelloMessage, {
    name: React.createElement("span", null, "Sebastian")
}), mountNode);
