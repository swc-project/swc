import * as swcHelpers from "@swc/helpers";
import { jsx as _jsx } from "preact/jsx-runtime";
import { createElement as _createElement } from "react";
import "./preact";
const props = {
    answer: 42
};
_jsx("div", swcHelpers.objectSpread({}, props, {
    children: "text"
}), "foo"), _createElement("div", swcHelpers.objectSpread({}, props, {
    key: "bar",
    children: "text"
}));
const props2 = {
    answer: 42
};
_jsx("div", swcHelpers.objectSpread({}, props2, {
    children: "text"
}), "foo"), _createElement("div", swcHelpers.objectSpread({}, props2, {
    key: "bar",
    children: "text"
}));
