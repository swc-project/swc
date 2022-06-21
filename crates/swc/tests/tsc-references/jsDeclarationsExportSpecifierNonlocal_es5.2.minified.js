import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
export var Thing = function() {
    "use strict";
    _class_call_check(this, Thing);
};
export var OtherThing = function() {
    "use strict";
    _class_call_check(this, OtherThing);
};
export { Thing, OtherThing as default } from "./source";
