//// [typesWithProtectedConstructor.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
new function C() {
    "use strict";
    _class_call_check(this, C);
}().constructor, new function C2(x) {
    "use strict";
    _class_call_check(this, C2);
}().constructor;
