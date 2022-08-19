import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
export var Thing = function Thing() {
    "use strict";
    _class_call_check(this, Thing);
};
export var OtherThing = function OtherThing() {
    "use strict";
    _class_call_check(this, OtherThing);
};
export { Thing, OtherThing as default } from "./source";
