//// [source.js]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
export var Thing = function Thing() {
    _class_call_check(this, Thing);
};
export var OtherThing = function OtherThing() {
    _class_call_check(this, OtherThing);
};
//// [index.js]
export { Thing, OtherThing as default } from "./source";
