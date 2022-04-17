import * as swcHelpers from "@swc/helpers";
let React = require('react');
class TextComponent extends React.Component {
    render() {
        return React.createElement("span", null, "Some Text..");
    }
}
swcHelpers.extends({}, {
    editable: !1
});
let textPropsTrue = {
    editable: !0,
    onEdit () {}
};
swcHelpers.extends({}, textPropsTrue);
