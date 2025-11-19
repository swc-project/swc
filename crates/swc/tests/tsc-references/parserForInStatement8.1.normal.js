//// [parserForInStatement8.ts]
// repro from https://github.com/microsoft/TypeScript/issues/54769
import { _ as _sliced_to_array } from "@swc/helpers/_/_sliced_to_array";
for(var ref in {
    '': 0
}){
    var _ref = _sliced_to_array(ref, 1), tmp = _ref[0], x = tmp === void 0 ? 'a' in {} : tmp;
    console.log(x);
}
for(var ref1 in {
    '': 0
}){
    var _ref_x = ref1.x, x1 = _ref_x === void 0 ? 'a' in {} : _ref_x;
    console.log(x1);
}
