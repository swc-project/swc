import * as swcHelpers from "@swc/helpers";
import { jsx as _jsx } from "preact/jsx-runtime";
import { createElement as _createElement } from "react";
import "./preact";
const props = {
    answer: 42
};
swcHelpers.objectSpread({}, props, {
    children: "text"
}), swcHelpers.objectSpread({}, props, {
    key: "bar",
    children: "text"
});
const props2 = {
    answer: 42
};
swcHelpers.objectSpread({}, props2, {
    children: "text"
}), swcHelpers.objectSpread({}, props2, {
    key: "bar",
    children: "text"
});
