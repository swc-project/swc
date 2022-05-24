import _extends from "@swc/helpers/lib/_extends.js";
let React = require('react');
class TextComponent extends React.Component {
    render() {
        return React.createElement("span", null, "Some Text..");
    }
}
_extends({}, {
    editable: !1
});
let textPropsTrue = {
    editable: !0,
    onEdit () {}
};
_extends({}, textPropsTrue);
