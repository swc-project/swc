//// [test.js]
/** @typedef {{
    status: 'done'
    m(n: number): void
}} DoneStatus */ // property assignment
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var ns = {};
/** @type {DoneStatus} */ ns.x = {
    status: "done",
    m: function(n) {}
}, ns.x = {
    status: "done",
    m: function(n) {}
}, ns.x;
// this-property assignment
var Thing = function() {
    function Thing() {
        _class_call_check(this, Thing), /** @type {DoneStatus} */ this.s = {
            status: "done",
            m: function(n) {}
        };
    }
    return Thing.prototype.fail = function() {
        this.s = {
            status: "done",
            m: function(n) {}
        };
    }, Thing;
}();
// exports-property assignment
/** @type {DoneStatus} */ exports.x = {
    status: "done",
    m: function(n) {}
}, exports.x, /** @type {DoneStatus} */ module.exports.y = {
    status: "done",
    m: function(n) {}
}, module.exports.y, // prototype-property assignment
/** @type {DoneStatus} */ Thing.prototype.x = {
    status: "done",
    m: function(n) {}
}, Thing.prototype.x;
//// [mod.js]
// module.exports assignment
/** @type {{ status: 'done', m(n: number): void }} */ module.exports = {
    status: "done",
    m: function(n) {}
};
