const React = require("react");
class TextComponent extends React.Component {
    render() {
        return React.createElement("span", null, "Some Text..");
    }
}
React.createElement(TextComponent, {
    editable: !0
});
export { };
