// @checkJs: true
// @allowJs: true
// @noEmit: true
// @Filename: test.js
// @strict: true
/** @typedef {{
    status: 'done'
    m(n: number): void
}} DoneStatus */ // property assignment
var ns = {
};
/** @type {DoneStatus} */ ns.x = {
    status: 'done',
    m (n) {
    }
};
ns.x = {
    status: 'done',
    m (n1) {
    }
};
ns.x;
// this-property assignment
class Thing {
    fail() {
        this.s = {
            status: 'done',
            m (n) {
            }
        };
    }
    constructor(){
        /** @type {DoneStatus} */ this.s = {
            status: 'done',
            m (n) {
            }
        };
    }
}
// exports-property assignment
/** @type {DoneStatus} */ exports.x = {
    status: "done",
    m (n2) {
    }
};
exports.x;
/** @type {DoneStatus} */ module.exports.y = {
    status: "done",
    m (n3) {
    }
};
module.exports.y;
// prototype-property assignment
/** @type {DoneStatus} */ Thing.prototype.x = {
    status: 'done',
    m (n4) {
    }
};
Thing.prototype.x;
// prototype assignment
function F() {
}
/** @type {DoneStatus} */ F.prototype = {
    status: "done",
    m (n5) {
    }
};
// @Filename: mod.js
// module.exports assignment
/** @type {{ status: 'done', m(n: number): void }} */ module.exports = {
    status: "done",
    m (n6) {
    }
};
