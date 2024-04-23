//// [objectRestReadonly.ts]
import { _ as _object_without_properties } from "@swc/helpers/_/_object_without_properties";
var obj = {
    foo: 'bar',
    baz: 'qux',
    quux: 'quuz'
};
obj.foo;
var rest = _object_without_properties(obj, [
    "foo"
]);
delete rest.baz;
