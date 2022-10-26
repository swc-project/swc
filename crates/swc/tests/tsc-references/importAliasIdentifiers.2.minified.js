//// [importAliasIdentifiers.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
(moduleA || (moduleA = {})).Point = function Point(x, y) {
    "use strict";
    _class_call_check(this, Point), this.x = x, this.y = y;
};
var moduleA, clodule = function clodule() {
    "use strict";
    _class_call_check(this, clodule);
};
function fundule() {
    return {
        x: 0,
        y: 0
    };
}
clodule || (clodule = {}), fundule || (fundule = {});
