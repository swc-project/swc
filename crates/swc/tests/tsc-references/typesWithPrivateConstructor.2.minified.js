//// [typesWithPrivateConstructor.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
new function C() {
    "use strict";
    _class_call_check(this, C);
}().constructor, new function C2(x) {
    "use strict";
    _class_call_check(this, C2);
}().constructor;
