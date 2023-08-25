//// [namedTupleMembers.ts]
import { _ as _sliced_to_array } from "@swc/helpers/_/_sliced_to_array";
import { _ as _to_consumable_array } from "@swc/helpers/_/_to_consumable_array";
a = b, a = c, b = a = d, b = c, b = d, c = a, c = b, c = d, d = a, d = b, d = c;
export var func = null;
export function useState(initial) {
    return null;
}
export function readSegment(param) {
    var _param = _sliced_to_array(param, 2);
    _param[0], _param[1];
}
// documenting binding pattern behavior (currently does _not_ generate tuple names)
export var val = null;
r = q = r, y = x = y;
export var argumentsOfGAsFirstArgument = f(getArgsForInjection(g)); // one tuple with captures arguments as first member
export var argumentsOfG = f.apply(void 0, _to_consumable_array(getArgsForInjection(g))); // captured arguments list re-spread
