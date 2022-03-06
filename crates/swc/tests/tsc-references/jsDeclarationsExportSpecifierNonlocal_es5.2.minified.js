import * as swcHelpers from "@swc/helpers";
export var Thing = function() {
    "use strict";
    swcHelpers.classCallCheck(this, Thing);
};
export var OtherThing = function() {
    "use strict";
    swcHelpers.classCallCheck(this, OtherThing);
};
export { Thing, OtherThing as default } from "./source";
