import { predom } from "./renderer2";
import prerendered from "./component";
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _createClass(Constructor, protoProps, staticProps) {
    return protoProps && _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), Constructor;
}
export var MySFC = function(props) {
    return predom("p", null, props.x, " + ", props.y, " = ", props.x + props.y);
};
export var MyClass = function() {
    "use strict";
    function MyClass(props) {
        _classCallCheck(this, MyClass), this.props = props;
    }
    return _createClass(MyClass, [
        {
            key: "render",
            value: function() {
                return predom("p", null, this.props.x, " + ", this.props.y, " = ", this.props.x + this.props.y);
            }
        }
    ]), MyClass;
}();
export var tree = predom(MySFC, {
    x: 1,
    y: 2
}, predom(MyClass, {
    x: 3,
    y: 4
}), predom(MyClass, {
    x: 5,
    y: 6
}));
export default predom("h", null);
predom("h", null);
var DOMSFC = function(props) {
    return predom("p", null, props.x, " + ", props.y, " = ", props.x + props.y, props.children);
}, DOMClass = function() {
    "use strict";
    function DOMClass(props) {
        _classCallCheck(this, DOMClass), this.props = props;
    }
    return _createClass(DOMClass, [
        {
            key: "render",
            value: function() {
                return predom("p", null, this.props.x, " + ", this.props.y, " = ", this.props.x + this.props.y);
            }
        }
    ]), DOMClass;
}();
predom(DOMSFC, {
    x: 1,
    y: 2
}, predom(DOMClass, {
    x: 3,
    y: 4
}), predom(DOMClass, {
    x: 5,
    y: 6
})), predom(MySFC, {
    x: 1,
    y: 2
}, predom(MyClass, {
    x: 3,
    y: 4
}), predom(MyClass, {
    x: 5,
    y: 6
})), predom(DOMSFC, {
    x: 1,
    y: 2
}, tree, tree);
