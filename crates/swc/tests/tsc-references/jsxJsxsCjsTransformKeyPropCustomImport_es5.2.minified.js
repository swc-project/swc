import * as swcHelpers from "@swc/helpers";
var props = {
    answer: 42
};
React.createElement("div", swcHelpers.extends({
    key: "foo"
}, props), "text"), React.createElement("div", swcHelpers.extends({}, props, {
    key: "bar"
}), "text");
