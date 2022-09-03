//// [objectTypeWithStringNamedPropertyOfIllegalCharacters.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var c, i, a, C = function C() {
    "use strict";
    _class_call_check(this, C);
}, r = c["   "], r2 = c["    "], r3 = c["a   b"], r4 = c["~!@#$%^&*()_+{}|:'<>?/.,`"], r = i["   "], r2 = i["    "], r3 = i["a   b"], r4 = i["~!@#$%^&*()_+{}|:'<>?/.,`"], r = a["   "], r2 = a["    "], r3 = a["a   b"], r4 = a["~!@#$%^&*()_+{}|:'<>?/.,`"], b = {
    "   ": 1,
    "a   b": "",
    "~!@#$%^&*()_+{}|:'<>?/.,`": 1
}, r = b["   "], r2 = b["    "], r3 = b["a   b"], r4 = b["~!@#$%^&*()_+{}|:'<>?/.,`"];
