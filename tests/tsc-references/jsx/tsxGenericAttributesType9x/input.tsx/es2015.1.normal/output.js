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
const React1 = require('react');
export function makeP(Ctor) {
    return class _class extends React1.PureComponent {
        render() {
            return(/*#__PURE__*/ React.createElement(Ctor, _extends({
            }, this.props)));
        }
    };
}
