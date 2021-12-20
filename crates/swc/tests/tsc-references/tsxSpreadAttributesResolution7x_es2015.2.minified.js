function _extends() {
    return (_extends = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source)Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
        }
        return target;
    }).apply(this, arguments);
}
const React = require("react");
class TextComponent extends React.Component {
    render() {
        return React.createElement("span", null, "Some Text..");
    }
}
React.createElement(TextComponent, _extends({
}, {
    editable: !1
})), React.createElement(TextComponent, _extends({
}, {
    editable: !0,
    onEdit: ()=>{
    }
}));
export { };
