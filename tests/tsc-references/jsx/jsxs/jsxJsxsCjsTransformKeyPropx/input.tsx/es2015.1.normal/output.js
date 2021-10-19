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
// @jsx: react-jsx,react-jsxdev
// @strict: true
// @module: commonjs
/// <reference path="/.lib/react16.d.ts" />
const props = {
    answer: 42
};
const a = /*#__PURE__*/ React.createElement("div", _extends({
    key: "foo"
}, props), "text");
const b = /*#__PURE__*/ React.createElement("div", _extends({
}, props, {
    key: "bar"
}), "text");
export { };
