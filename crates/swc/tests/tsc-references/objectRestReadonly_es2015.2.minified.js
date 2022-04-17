import * as swcHelpers from "@swc/helpers";
let obj = {
    foo: 'bar',
    baz: 'qux',
    quux: 'quuz'
}, { foo  } = obj, rest = swcHelpers.objectWithoutProperties(obj, [
    "foo"
]);
delete rest.baz;
