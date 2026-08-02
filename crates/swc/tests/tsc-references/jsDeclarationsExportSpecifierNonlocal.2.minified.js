//// [source.js]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
export var Thing = function Thing() {
    "use strict";
    _class_call_check(this, Thing);
};
export var OtherThing = function OtherThing() {
    "use strict";
    _class_call_check(this, OtherThing);
};
//// [index.js]
export { Thing, OtherThing as default } from "./source";
