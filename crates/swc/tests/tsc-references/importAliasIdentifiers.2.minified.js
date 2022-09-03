//// [importAliasIdentifiers.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
!function(moduleA) {
    var Point = function Point(x, y) {
        "use strict";
        _class_call_check(this, Point), this.x = x, this.y = y;
    };
    moduleA.Point = Point;
}(moduleA || (moduleA = {}));
var moduleA, p, clodule = function clodule() {
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
