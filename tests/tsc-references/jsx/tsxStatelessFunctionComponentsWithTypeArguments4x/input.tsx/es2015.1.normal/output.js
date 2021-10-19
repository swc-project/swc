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
// @module: amd
// @noLib: true
// @skipLibCheck: true
// @libFiles: react.d.ts,lib.d.ts
const React = require('react');
// Error
function Baz(arg1, arg2) {
    let a0 = /*#__PURE__*/ React.createElement(OverloadComponent, {
        a: arg1.b
    });
    let a2 = /*#__PURE__*/ React.createElement(OverloadComponent, _extends({
    }, arg1, {
        "ignore-prop": true
    })) // missing a
    ;
}
export { };
