//// [thisPrototypeMethodCompoundAssignmentJs.ts]
//// [index.js]
var _Element_prototype, _Element_prototype1, _remove, _remove1;
null !== (_remove = (_Element_prototype = Element.prototype).remove) && void 0 !== _remove || (_Element_prototype.remove = function() {
    var _this_parentNode;
    null === (_this_parentNode = this.parentNode) || void 0 === _this_parentNode || _this_parentNode.removeChild(this);
}), null !== (_remove1 = (_Element_prototype1 = Element.prototype).remove) && void 0 !== _remove1 || (_Element_prototype1.remove = function() {
    var _this_parentNode;
    null === (_this_parentNode = this.parentNode) || void 0 === _this_parentNode || _this_parentNode.removeChild(this);
});
