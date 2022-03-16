import * as swcHelpers from "@swc/helpers";
const React = require("react");
class TextComponent extends React.Component {
    render() {
        return React.createElement("span", null, "Some Text..");
    }
}
swcHelpers.extends({}, {
    editable: !1
});
const textPropsTrue = {
    editable: !0,
    onEdit () {}
};
swcHelpers.extends({}, textPropsTrue);
