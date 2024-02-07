//// [thisPrototypeMethodCompoundAssignmentJs.ts]
//// [index.js]
var _Element_prototype, /**
 * @this Node
 */ _Element_prototype1;
var _remove;
(_remove = (_Element_prototype = Element.prototype).remove) !== null && _remove !== void 0 ? _remove : _Element_prototype.remove = function() {
    var _this_parentNode;
    (_this_parentNode = this.parentNode) === null || _this_parentNode === void 0 ? void 0 : _this_parentNode.removeChild(this);
};
var _remove1;
(_remove1 = (_Element_prototype1 = Element.prototype).remove) !== null && _remove1 !== void 0 ? _remove1 : _Element_prototype1.remove = function() {
    var _this_parentNode;
    (_this_parentNode = this.parentNode) === null || _this_parentNode === void 0 ? void 0 : _this_parentNode.removeChild(this);
};
