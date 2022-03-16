import * as swcHelpers from "@swc/helpers";
swcHelpers.extends({}, {
    x: (n)=>0
}), swcHelpers.extends({}, {
    x: (n)=>n.len
});
