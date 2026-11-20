import { _ as _define_property } from "@swc/helpers/_/_define_property";
import { _ as _wrap_reg_exp } from "@swc/helpers/_/_wrap_reg_exp";
// Loose mode lowers computed keys to assignments, so `__proto__` must be
// defined with `_define_property` to stay an own property of the mapping.
export var protoName = _wrap_reg_exp(/(?:(a)|(b))(?:\1\2)/, _define_property({}, "__proto__", [
    1,
    2
]), "(?:(?<__proto__>a)|(?<__proto__>b))\\k<__proto__>");
