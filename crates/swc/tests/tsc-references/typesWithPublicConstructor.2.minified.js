//// [typesWithPublicConstructor.ts]
// public is allowed on a constructor but is not meaningful
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
new function C() {
    _class_call_check(this, C);
}().constructor, new function C2(x) {
    _class_call_check(this, C2);
}().constructor;
