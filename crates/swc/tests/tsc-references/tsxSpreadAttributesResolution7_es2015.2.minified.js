import * as swcHelpers from "@swc/helpers";
const React = require("react");
class TextComponent extends React.Component {
    render() {
        return React.createElement("span", null, "Some Text..");
    }
}
React.createElement(TextComponent, swcHelpers.extends({}, {
    editable: !1
})), React.createElement(TextComponent, swcHelpers.extends({}, {
    editable: !0,
    onEdit: ()=>{}
}));
