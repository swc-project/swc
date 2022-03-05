import * as swcHelpers from "@swc/helpers";
var obj = {
    foo: "bar",
    baz: "qux",
    quux: "quuz"
};
obj.foo, delete swcHelpers.objectWithoutProperties(obj, [
    "foo"
]).baz;
