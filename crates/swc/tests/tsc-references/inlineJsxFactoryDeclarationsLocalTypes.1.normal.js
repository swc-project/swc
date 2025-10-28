//// [renderer.d.ts]
export { };
//// [renderer2.d.ts]
export { };
//// [component.tsx]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _to_consumable_array } from "@swc/helpers/_/_to_consumable_array";
var _this = this;
export var MySFC = function(props) {
    return /*#__PURE__*/ React.createElement.apply(React, [
        "p",
        null,
        props.x,
        " + ",
        props.y,
        " = ",
        props.x + props.y
    ].concat(_to_consumable_array(_this.props.children)));
};
export var MyClass = /*#__PURE__*/ function() {
    "use strict";
    function MyClass(props) {
        _class_call_check(this, MyClass);
        this.props = props;
    }
    var _proto = MyClass.prototype;
    _proto.render = function render() {
        return /*#__PURE__*/ React.createElement.apply(React, [
            "p",
            null,
            this.props.x,
            " + ",
            this.props.y,
            " = ",
            this.props.x + this.props.y
        ].concat(_to_consumable_array(this.props.children)));
    };
    return MyClass;
}();
export var tree = /*#__PURE__*/ React.createElement(MySFC, {
    x: 1,
    y: 2
}, /*#__PURE__*/ React.createElement(MyClass, {
    x: 3,
    y: 4
}), /*#__PURE__*/ React.createElement(MyClass, {
    x: 5,
    y: 6
}));
export default /*#__PURE__*/ React.createElement("h", null);
//// [index.tsx]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _to_consumable_array } from "@swc/helpers/_/_to_consumable_array";
import prerendered, { MySFC, MyClass, tree } from "./component";
var elem = prerendered;
elem = /*#__PURE__*/ React.createElement("h", null); // Expect assignability error here
var DOMSFC = function(props) {
    return /*#__PURE__*/ React.createElement("p", null, props.x, " + ", props.y, " = ", props.x + props.y, props.children);
};
var DOMClass = /*#__PURE__*/ function() {
    "use strict";
    function DOMClass(props) {
        _class_call_check(this, DOMClass);
        this.props = props;
    }
    var _proto = DOMClass.prototype;
    _proto.render = function render() {
        return /*#__PURE__*/ React.createElement.apply(React, [
            "p",
            null,
            this.props.x,
            " + ",
            this.props.y,
            " = ",
            this.props.x + this.props.y
        ].concat(_to_consumable_array(this.props.children)));
    };
    return DOMClass;
}();
// Should work, everything is a DOM element
var _tree = /*#__PURE__*/ React.createElement(DOMSFC, {
    x: 1,
    y: 2
}, /*#__PURE__*/ React.createElement(DOMClass, {
    x: 3,
    y: 4
}), /*#__PURE__*/ React.createElement(DOMClass, {
    x: 5,
    y: 6
}));
// Should fail, no dom elements
var _brokenTree = /*#__PURE__*/ React.createElement(MySFC, {
    x: 1,
    y: 2
}, /*#__PURE__*/ React.createElement(MyClass, {
    x: 3,
    y: 4
}), /*#__PURE__*/ React.createElement(MyClass, {
    x: 5,
    y: 6
}));
// Should fail, nondom isn't allowed as children of dom
var _brokenTree2 = /*#__PURE__*/ React.createElement(DOMSFC, {
    x: 1,
    y: 2
}, tree, tree);
