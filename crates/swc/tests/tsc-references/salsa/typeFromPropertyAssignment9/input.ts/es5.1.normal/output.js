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
// @noEmit: true
// @allowJs: true
// @checkJs: true
// @target: es6
// @Filename: a.js
var my = my || {
};
/** @param {number} n */ my.method = function(n) {
    return n + 1;
};
my.number = 1;
my.object = {
};
my.predicate = my.predicate || {
};
my.predicate.query = function() {
    var me = this;
    me.property = false;
};
var q = new my.predicate.query();
my.predicate.query.another = function() {
    return 1;
};
my.predicate.query.result = 'none';
/** @param {number} first
 *  @param {number} second
 */ my.predicate.sort = my.predicate.sort || function(first, second) {
    return first > second ? first : second;
};
my.predicate.type = /*#__PURE__*/ (function() {
    "use strict";
    function _class() {
        _classCallCheck(this, _class);
    }
    _createClass(_class, [
        {
            key: "m",
            value: function m() {
                return 101;
            }
        }
    ]);
    return _class;
})();
// global-ish prefixes
var min = window.min || {
};
min.nest = this.min.nest || function() {
};
min.nest.other = self.min.nest.other || function _class() {
    "use strict";
    _classCallCheck(this, _class);
};
min.property = global.min.property || {
};
