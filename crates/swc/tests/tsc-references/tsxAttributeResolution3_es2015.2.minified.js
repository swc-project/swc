import * as swcHelpers from "@swc/helpers";
React.createElement("test1", swcHelpers.extends({}, {
    x: "foo"
})), React.createElement("test1", swcHelpers.extends({}, {
    x: 32
})), React.createElement("test1", swcHelpers.extends({}, {
    y: 32
})), React.createElement("test1", swcHelpers.extends({}, {
    x: 32,
    y: 32
}, {
    x: "ok"
})), React.createElement("test1", swcHelpers.extends({
    x: "ok"
}, {
    x: 32,
    y: 32
})), React.createElement("test1", swcHelpers.extends({}, {
    x: "ok",
    y: 32,
    extra: 100
})), React.createElement("test1", swcHelpers.extends({
    x: 32
}, {
    x: "foo"
}));
