import * as swcHelpers from "@swc/helpers";
React.createElement("test1", swcHelpers.extends({}, {
    x: (n)=>0
})), React.createElement("test1", swcHelpers.extends({}, {
    x: (n)=>n.len
}));
