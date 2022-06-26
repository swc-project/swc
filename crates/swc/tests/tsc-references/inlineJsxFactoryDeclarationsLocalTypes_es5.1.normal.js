import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
// @filename: component.tsx
/** @jsx predom */ import { predom } from "./renderer2";
import prerendered from "./component";
export var MySFC = function(props) {
    return /*#__PURE__*/ predom("p", null, props.x, " + ", props.y, " = ", props.x + props.y);
};
export var MyClass = /*#__PURE__*/ function() {
    "use strict";
    function MyClass(props) {
        _class_call_check(this, MyClass);
        this.props = props;
    }
    var _proto = MyClass.prototype;
    _proto.render = function render() {
        return /*#__PURE__*/ predom("p", null, this.props.x, " + ", this.props.y, " = ", this.props.x + this.props.y);
    };
    return MyClass;
}();
export var tree = /*#__PURE__*/ predom(MySFC, {
    x: 1,
    y: 2
}, /*#__PURE__*/ predom(MyClass, {
    x: 3,
    y: 4
}), /*#__PURE__*/ predom(MyClass, {
    x: 5,
    y: 6
}));
export default /*#__PURE__*/ predom("h", null);
var elem = prerendered;
elem = /*#__PURE__*/ predom("h", null); // Expect assignability error here
var DOMSFC = function(props) {
    return /*#__PURE__*/ predom("p", null, props.x, " + ", props.y, " = ", props.x + props.y, props.children);
};
var DOMClass = /*#__PURE__*/ function() {
    "use strict";
    function DOMClass(props) {
        _class_call_check(this, DOMClass);
        this.props = props;
    }
    var _proto = DOMClass.prototype;
    _proto.render = function render() {
        return /*#__PURE__*/ predom("p", null, this.props.x, " + ", this.props.y, " = ", this.props.x + this.props.y);
    };
    return DOMClass;
}();
// Should work, everything is a DOM element
var _tree = /*#__PURE__*/ predom(DOMSFC, {
    x: 1,
    y: 2
}, /*#__PURE__*/ predom(DOMClass, {
    x: 3,
    y: 4
}), /*#__PURE__*/ predom(DOMClass, {
    x: 5,
    y: 6
}));
// Should fail, no dom elements
var _brokenTree = /*#__PURE__*/ predom(MySFC, {
    x: 1,
    y: 2
}, /*#__PURE__*/ predom(MyClass, {
    x: 3,
    y: 4
}), /*#__PURE__*/ predom(MyClass, {
    x: 5,
    y: 6
}));
// Should fail, nondom isn't allowed as children of dom
var _brokenTree2 = /*#__PURE__*/ predom(DOMSFC, {
    x: 1,
    y: 2
}, tree, tree);
