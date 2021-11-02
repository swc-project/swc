function _extends() {
    return (_extends = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source)Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
        }
        return target;
    }).apply(this, arguments);
}
const React1 = require("react");
export function makeP(Ctor) {
    return class extends React1.PureComponent {
        render() {
            return React.createElement(Ctor, _extends({
            }, this.props));
        }
    };
}
