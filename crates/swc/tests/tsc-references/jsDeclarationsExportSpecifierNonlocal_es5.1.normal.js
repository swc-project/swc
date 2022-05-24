import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
// @allowJs: true
// @checkJs: true
// @target: es5
// @outDir: ./out
// @declaration: true
// @filename: source.js
export var Thing = function Thing() {
    "use strict";
    _class_call_check(this, Thing);
};
export var OtherThing = function OtherThing() {
    "use strict";
    _class_call_check(this, OtherThing);
};
// @filename: index.js
export { Thing, OtherThing as default } from "./source";
