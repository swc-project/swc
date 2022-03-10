var p1, p2, p3;
import * as swcHelpers from "@swc/helpers";
swcHelpers.extends({}, p1), swcHelpers.extends({}, p1), swcHelpers.extends({
    x: p3
}, p1), swcHelpers.extends({}, p1, {
    x: p3
}), swcHelpers.extends({
    x: p2
}, p1, {
    y: p3
});
