//// [test.js]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var ns = {};
ns.x = {
    status: 'done',
    m: function(n) {}
}, ns.x = {
    status: 'done',
    m: function(n) {}
}, ns.x;
var Thing = /*#__PURE__*/ function() {
    function Thing() {
        _class_call_check(this, Thing), this.s = {
            status: 'done',
            m: function(n) {}
        };
    }
    return Thing.prototype.fail = function() {
        this.s = {
            status: 'done',
            m: function(n) {}
        };
    }, Thing;
}();
exports.x = {
    status: "done",
    m: function(n) {}
}, exports.x, module.exports.y = {
    status: "done",
    m: function(n) {}
}, module.exports.y, Thing.prototype.x = {
    status: 'done',
    m: function(n) {}
}, Thing.prototype.x;
//// [mod.js]
module.exports = {
    status: "done",
    m: function(n) {}
};
