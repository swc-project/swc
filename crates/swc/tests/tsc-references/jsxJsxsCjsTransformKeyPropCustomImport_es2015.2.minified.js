import * as swcHelpers from "@swc/helpers";
let props = {
    answer: 42
};
swcHelpers.extends({
    key: "foo"
}, props), swcHelpers.extends({}, props, {
    key: "bar"
});
