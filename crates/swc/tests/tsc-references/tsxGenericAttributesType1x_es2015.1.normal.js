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
const decorator = function(Component) {
    return (props)=>/*#__PURE__*/ React.createElement(Component, _extends({}, props))
    ;
};
const decorator2 = function(Component) {
    return (props)=>/*#__PURE__*/ React.createElement(Component, _extends({}, props, {
            x: 2
        }))
    ;
};
const decorator3 = function(Component) {
    return (props)=>/*#__PURE__*/ React.createElement(Component, _extends({
            x: 2
        }, props))
    ;
};
export { };
