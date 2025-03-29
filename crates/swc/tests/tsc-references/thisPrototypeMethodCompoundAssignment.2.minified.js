//// [thisPrototypeMethodCompoundAssignment.ts]
var _Element_prototype;
null != (_Element_prototype = Element.prototype).remove || (_Element_prototype.remove = function() {
    var _this_parentNode;
    null == (_this_parentNode = this.parentNode) || _this_parentNode.removeChild(this);
});
