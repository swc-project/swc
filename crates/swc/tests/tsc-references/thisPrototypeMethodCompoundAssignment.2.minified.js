//// [thisPrototypeMethodCompoundAssignment.ts]
var _Element_prototype, _remove;
null !== (_remove = (_Element_prototype = Element.prototype).remove) && void 0 !== _remove || (_Element_prototype.remove = function() {
    var _this_parentNode;
    null === (_this_parentNode = this.parentNode) || void 0 === _this_parentNode || _this_parentNode.removeChild(this);
});
