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
// @strictNullChecks: true
const React = require('react');
class Button extends React.Component {
    render() {
        // Error children are specified twice
        return(/*#__PURE__*/ React.createElement(InnerButton, _extends({
        }, this.props, {
            children: "hi"
        }), /*#__PURE__*/ React.createElement("div", null, "Hello World")));
    }
}
class InnerButton extends React.Component {
    render() {
        return(/*#__PURE__*/ React.createElement("button", null, "Hello"));
    }
}
export { };
