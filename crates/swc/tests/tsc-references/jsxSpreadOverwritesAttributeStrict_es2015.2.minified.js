import * as swcHelpers from "@swc/helpers";
require('react');
let props = {
    a: 1,
    b: 1
};
swcHelpers.extends({}, props), swcHelpers.extends({
    d: 1
}, props), swcHelpers.extends({
    a: 1
}, props), swcHelpers.extends({
    a: 1,
    b: 2
}, props), swcHelpers.extends({
    a: 1,
    d: 1
}, props, {
    d: 1
}), swcHelpers.extends({
    a: 1,
    d: 1
}, props, {
    a: 1,
    d: 1
});
