import * as swcHelpers from "@swc/helpers";
// @allowJs: true
// @checkJs: true
// @target: es5
// @outDir: ./out
// @declaration: true
// @filename: source.js
export var Thing = function Thing() {
    "use strict";
    swcHelpers.classCallCheck(this, Thing);
};
export var OtherThing = function OtherThing() {
    "use strict";
    swcHelpers.classCallCheck(this, OtherThing);
};
// @filename: index.js
export { Thing, OtherThing as default } from "./source";
