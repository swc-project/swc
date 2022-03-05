import * as swcHelpers from "@swc/helpers";
React.createElement("test1", swcHelpers.extends({}, {
    x: function(n) {
        return 0;
    }
})), React.createElement("test1", swcHelpers.extends({}, {
    x: function(n) {
        return n.len;
    }
}));
