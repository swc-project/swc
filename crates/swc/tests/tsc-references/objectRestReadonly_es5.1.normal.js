import * as swcHelpers from "@swc/helpers";
var obj = {
    foo: "bar",
    baz: "qux",
    quux: "quuz"
};
var foo = obj.foo, rest = swcHelpers.objectWithoutProperties(obj, [
    "foo"
]);
delete rest.baz;
