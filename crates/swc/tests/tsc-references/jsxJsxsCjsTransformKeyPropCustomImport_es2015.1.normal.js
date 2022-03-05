import * as swcHelpers from "@swc/helpers";
// @jsx: react-jsx,react-jsxdev
// @jsxImportSource: preact
// @strict: true
// @module: commonjs
/// <reference path="/.lib/react16.d.ts" />
const props = {
    answer: 42
};
const a = /*#__PURE__*/ React.createElement("div", swcHelpers.extends({
    key: "foo"
}, props), "text");
const b = /*#__PURE__*/ React.createElement("div", swcHelpers.extends({}, props, {
    key: "bar"
}), "text");
export { };
