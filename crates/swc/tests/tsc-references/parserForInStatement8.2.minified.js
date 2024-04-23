//// [parserForInStatement8.ts]
import { _ as _sliced_to_array } from "@swc/helpers/_/_sliced_to_array";
for(var ref in {
    '': 0
}){
    var tmp = _sliced_to_array(ref, 1)[0];
    console.log(void 0 === tmp ? 'a' in {} : tmp);
}
for(var ref1 in {
    '': 0
}){
    var _ref_x = ref1.x;
    console.log(void 0 === _ref_x ? 'a' in {} : _ref_x);
}
