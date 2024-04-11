//// [mappedTypesGenericTuples2.ts]
import { _ as _to_consumable_array } from "@swc/helpers/_/_to_consumable_array";
Promise.all([
    getT()
].concat(_to_consumable_array(getT()))).then(function(result) {
    result[0], result.slice(1);
});
