import _sliced_to_array from "@swc/helpers/lib/_sliced_to_array.js";
import _to_consumable_array from "@swc/helpers/lib/_to_consumable_array.js";
a = b;
a = c;
a = d;
b = a;
b = c;
b = d;
c = a;
c = b;
c = d;
d = a;
d = b;
d = c;
export var func = null;
export function useState(initial) {
    return null;
}
export function readSegment(param) {
    var _param = _sliced_to_array(param, 2), length = _param[0], count = _param[1];
}
// documenting binding pattern behavior (currently does _not_ generate tuple names)
export var val = null;
q = r;
r = q;
x = y;
y = x;
export var argumentsOfGAsFirstArgument = f(getArgsForInjection(g)); // one tuple with captures arguments as first member
export var argumentsOfG = f.apply(void 0, _to_consumable_array(getArgsForInjection(g))); // captured arguments list re-spread
