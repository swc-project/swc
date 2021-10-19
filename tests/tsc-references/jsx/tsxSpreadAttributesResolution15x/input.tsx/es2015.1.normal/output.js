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
    return(/*#__PURE__*/ React.createElement(AnotherComponent, _extends({
    }, props, {
        property2: true,
        AnotherProperty1: "hi"
    })));
};
function AnotherComponent({ property1  }) {
    return(/*#__PURE__*/ React.createElement("span", null, property1));
}
