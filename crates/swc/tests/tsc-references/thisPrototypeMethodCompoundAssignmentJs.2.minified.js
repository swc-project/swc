//// [thisPrototypeMethodCompoundAssignmentJs.ts]
//// [index.js]
var _Element_prototype, _Element_prototype1;
null != (_Element_prototype = Element.prototype).remove || (_Element_prototype.remove = function() {
    var _this_parentNode;
    null == (_this_parentNode = this.parentNode) || _this_parentNode.removeChild(this);
}), null != (_Element_prototype1 = Element.prototype).remove || (_Element_prototype1.remove = function() {
    var _this_parentNode;
    null == (_this_parentNode = this.parentNode) || _this_parentNode.removeChild(this);
});
