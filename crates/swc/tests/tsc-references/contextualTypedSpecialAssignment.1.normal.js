//// [test.js]
/** @typedef {{
    status: 'done'
    m(n: number): void
}} DoneStatus */ // property assignment
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var ns = {};
/** @type {DoneStatus} */ ns.x = {
    status: 'done',
    m: function m(n) {}
};
ns.x = {
    status: 'done',
    m: function m(n) {}
};
ns.x;
// this-property assignment
var Thing = /*#__PURE__*/ function() {
    "use strict";
    function Thing() {
        _class_call_check(this, Thing);
        /** @type {DoneStatus} */ this.s = {
            status: 'done',
            m: function m(n) {}
        };
    }
    var _proto = Thing.prototype;
    _proto.fail = function fail() {
        this.s = {
            status: 'done',
            m: function m(n) {}
        };
    };
    return Thing;
}();
// exports-property assignment
/** @type {DoneStatus} */ exports.x = {
    status: "done",
    m: function m(n) {}
};
exports.x;
/** @type {DoneStatus} */ module.exports.y = {
    status: "done",
    m: function m(n) {}
};
module.exports.y;
// prototype-property assignment
/** @type {DoneStatus} */ Thing.prototype.x = {
    status: 'done',
    m: function m(n) {}
};
Thing.prototype.x;
// prototype assignment
function F() {}
/** @type {DoneStatus} */ F.prototype = {
    status: "done",
    m: function m(n) {}
};
//// [mod.js]
// module.exports assignment
/** @type {{ status: 'done', m(n: number): void }} */ module.exports = {
    status: "done",
    m: function m(n) {}
};
