//// [objectRestReadonly.ts]
// #23734
import { _ as _object_without_properties } from "@swc/helpers/_/_object_without_properties";
var obj = {
    foo: 'bar',
    baz: 'qux',
    quux: 'quuz'
};
var foo = obj.foo, rest = _object_without_properties(obj, [
    "foo"
]);
delete rest.baz;
