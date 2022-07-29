import _extends from "@swc/helpers/src/_extends.mjs";
let React = require('react');
class TextComponent extends React.Component {
    render() {
        return React.createElement("span", null, "Some Text..");
    }
}
_extends({}, {
    editable: !1
}), _extends({}, {
    editable: !0,
    onEdit: ()=>{}
});
