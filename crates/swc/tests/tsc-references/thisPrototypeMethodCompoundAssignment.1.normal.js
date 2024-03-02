//// [thisPrototypeMethodCompoundAssignment.ts]
var _Element_prototype;
var _remove;
(_remove = (_Element_prototype = Element.prototype).remove) !== null && _remove !== void 0 ? _remove : _Element_prototype.remove = function() {
    var _this_parentNode;
    (_this_parentNode = this.parentNode) === null || _this_parentNode === void 0 ? void 0 : _this_parentNode.removeChild(this);
};
