function _extends() {
    return (_extends = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source)Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
        }
        return target;
    }).apply(this, arguments);
}
export class Empty extends React.Component {
    render() {
        return React.createElement("div", null, "Hello");
    }
}
React.createElement(Empty, _extends({
}, obj));
