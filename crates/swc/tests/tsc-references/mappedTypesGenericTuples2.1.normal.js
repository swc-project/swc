//// [mappedTypesGenericTuples2.ts]
// https://github.com/microsoft/TypeScript/issues/57389
import { _ as _to_consumable_array } from "@swc/helpers/_/_to_consumable_array";
Promise.all([
    getT()
].concat(_to_consumable_array(getT()))).then(function(result) {
    var head = result[0]; // string
    var tail = result.slice(1); // any[]
    tail; // ok
});
