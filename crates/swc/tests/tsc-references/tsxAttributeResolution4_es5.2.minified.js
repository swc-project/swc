import * as swcHelpers from "@swc/helpers";
swcHelpers.extends({}, {
    x: function(n) {
        return 0;
    }
}), swcHelpers.extends({}, {
    x: function(n) {
        return n.len;
    }
});
