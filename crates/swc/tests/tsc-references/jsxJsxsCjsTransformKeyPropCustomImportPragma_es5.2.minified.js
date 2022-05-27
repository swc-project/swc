import _object_spread from "@swc/helpers/lib/_object_spread.js";
import _object_spread_props from "@swc/helpers/lib/_object_spread_props.js";
import { jsx as _jsx } from "preact/jsx-runtime";
import { createElement as _createElement } from "react";
import "./preact";
var props = {
    answer: 42
};
_object_spread_props(_object_spread({}, props), {
    children: "text"
}), _object_spread_props(_object_spread({}, props), {
    key: "bar"
});
var props2 = {
    answer: 42
};
_object_spread_props(_object_spread({}, props2), {
    children: "text"
}), _object_spread_props(_object_spread({}, props2), {
    key: "bar"
});
