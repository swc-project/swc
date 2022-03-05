import * as swcHelpers from "@swc/helpers";
const obj = {
    foo: 'bar',
    baz: 'qux',
    quux: 'quuz'
};
const { foo  } = obj, rest = swcHelpers.objectWithoutProperties(obj, [
    "foo"
]);
delete rest.baz;
