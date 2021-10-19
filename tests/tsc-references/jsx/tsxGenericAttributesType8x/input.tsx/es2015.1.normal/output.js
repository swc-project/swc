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
const decorator = function(props) {
    return(/*#__PURE__*/ React.createElement(Component, _extends({
    }, props)));
};
const decorator1 = function(props) {
    return(/*#__PURE__*/ React.createElement(Component, _extends({
    }, props)));
};
export { };
