import * as swcHelpers from "@swc/helpers";
const props = {
    answer: 42
};
swcHelpers.extends({
    key: "foo"
}, props), swcHelpers.extends({}, props, {
    key: "bar"
});
