import * as swcHelpers from "@swc/helpers";
// @checkJs: true
// @allowJs: true
// @noEmit: true
// @Filename: test.js
// @strict: true
/** @typedef {{
    status: 'done'
    m(n: number): void
}} DoneStatus */ // property assignment
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
var Thing = // this-property assignment
/*#__PURE__*/ function() {
    "use strict";
    function Thing() {
        swcHelpers.classCallCheck(this, Thing);
        /** @type {DoneStatus} */ this.s = {
            status: 'done',
            m: function m(n) {}
        };
    }
    swcHelpers.createClass(Thing, [
        {
            key: "fail",
            value: function fail() {
                this.s = {
                    status: 'done',
                    m: function m(n) {}
                };
            }
        }
    ]);
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
// @Filename: mod.js
// module.exports assignment
/** @type {{ status: 'done', m(n: number): void }} */ module.exports = {
    status: "done",
    m: function m(n) {}
};
