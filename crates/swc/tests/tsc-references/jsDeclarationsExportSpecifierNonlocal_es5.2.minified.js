import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
export var Thing = function() {
    "use strict";
    _class_call_check(this, Thing);
};
export var OtherThing = function() {
    "use strict";
    _class_call_check(this, OtherThing);
};
export { Thing, OtherThing as default } from "./source";
