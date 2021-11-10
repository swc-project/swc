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
export default function Component(props) {
    let condition1;
    if (condition1) {
        return(/*#__PURE__*/ React.createElement(ChildComponent, _extends({
        }, props)));
    } else {
        return(/*#__PURE__*/ React.createElement(ChildComponent, _extends({
        }, props, {
            property1: "NewString"
        })));
    }
};
function ChildComponent({ property1  }) {
    return(/*#__PURE__*/ React.createElement("span", null, property1));
}
