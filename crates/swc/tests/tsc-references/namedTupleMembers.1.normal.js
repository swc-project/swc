//// [namedTupleMembers.ts]
import { _ as _sliced_to_array } from "@swc/helpers/_/_sliced_to_array";
import { _ as _to_consumable_array } from "@swc/helpers/_/_to_consumable_array";
a1 = b1;
a1 = c1;
a1 = d1;
b1 = a1;
b1 = c1;
b1 = d1;
c1 = a1;
c1 = b1;
c1 = d1;
d1 = a1;
d1 = b1;
d1 = c1;
export var func = null;
export function useState(initial) {
    return null;
}
export function readSegment(param) {
    var _param = _sliced_to_array(param, 2), length = _param[0], count = _param[1];
}
// documenting binding pattern behavior (currently does _not_ generate tuple names)
export var val = null;
q1 = r1;
r1 = q1;
x1 = y1;
y1 = x1;
export var argumentsOfGAsFirstArgument = f(getArgsForInjection(g)); // one tuple with captures arguments as first member
export var argumentsOfG = f.apply(void 0, _to_consumable_array(getArgsForInjection(g))); // captured arguments list re-spread
