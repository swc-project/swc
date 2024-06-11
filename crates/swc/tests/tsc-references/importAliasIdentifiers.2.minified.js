//// [importAliasIdentifiers.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
(moduleA || (moduleA = {})).Point = function Point(x, y) {
    _class_call_check(this, Point), this.x = x, this.y = y;
};
var moduleA, clodule = function clodule() {
    _class_call_check(this, clodule);
};
function fundule() {
    return {
        x: 0,
        y: 0
    };
}
clodule || (clodule = {}), fundule || (fundule = {});
