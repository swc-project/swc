function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}
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
    m: function(n) {
    }
};
ns.x = {
    status: 'done',
    m: function(n) {
    }
};
ns.x;
var Thing = // this-property assignment
/*#__PURE__*/ function() {
    "use strict";
    function Thing() {
        _classCallCheck(this, Thing);
        /** @type {DoneStatus} */ this.s = {
            status: 'done',
            m: function(n) {
            }
        };
    }
    _createClass(Thing, [
        {
            key: "fail",
            value: function fail() {
                this.s = {
                    status: 'done',
                    m: function(n) {
                    }
                };
            }
        }
    ]);
    return Thing;
}();
// exports-property assignment
/** @type {DoneStatus} */ exports.x = {
    status: "done",
    m: function(n) {
    }
};
exports.x;
/** @type {DoneStatus} */ module.exports.y = {
    status: "done",
    m: function(n) {
    }
};
module.exports.y;
// prototype-property assignment
/** @type {DoneStatus} */ Thing.prototype.x = {
    status: 'done',
    m: function(n) {
    }
};
Thing.prototype.x;
// prototype assignment
function F() {
}
/** @type {DoneStatus} */ F.prototype = {
    status: "done",
    m: function(n) {
    }
};
// @Filename: mod.js
// module.exports assignment
/** @type {{ status: 'done', m(n: number): void }} */ module.exports = {
    status: "done",
    m: function(n) {
    }
};
