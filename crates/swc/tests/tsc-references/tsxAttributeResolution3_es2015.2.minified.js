import * as swcHelpers from "@swc/helpers";
swcHelpers.extends({}, {
    x: 'foo'
}), swcHelpers.extends({}, {
    x: 32
}), swcHelpers.extends({}, {
    y: 32
}), swcHelpers.extends({}, {
    x: 32,
    y: 32
}, {
    x: "ok"
}), swcHelpers.extends({
    x: "ok"
}, {
    x: 32,
    y: 32
}), swcHelpers.extends({}, {
    x: 'ok',
    y: 32,
    extra: 100
}), swcHelpers.extends({
    x: 32
}, {
    x: 'foo'
});
