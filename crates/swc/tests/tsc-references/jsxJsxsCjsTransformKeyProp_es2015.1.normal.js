import _extends from "@swc/helpers/src/_extends.mjs";
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
const b = /*#__PURE__*/ React.createElement("div", _extends({}, props, {
    key: "bar"
}), "text");
export { };
