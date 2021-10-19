function _extends() {
    _extends = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source){
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }
        return target;
    };
    return _extends.apply(this, arguments);
}
// @filename: file.tsx
// @jsx: preserve
// @noLib: true
// @skipLibCheck: true
// @libFiles: react.d.ts,lib.d.ts
const React = require('react');
class B1 extends React.Component {
    render() {
        return(/*#__PURE__*/ React.createElement("div", null, "hi"));
    }
}
class B extends React.Component {
    render() {
        return(/*#__PURE__*/ React.createElement(B1, _extends({
        }, this.props, {
            x: "hi"
        })));
    }
}
export { };
