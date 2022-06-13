import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import { predom } from "./renderer2";
import prerendered from "./component";
export var MySFC = function(props) {
    return predom("p", null, props.x, " + ", props.y, " = ", props.x + props.y);
};
export var MyClass = function() {
    "use strict";
    function MyClass(props) {
        _class_call_check(this, MyClass), this.props = props;
    }
    return MyClass.prototype.render = function() {
        return predom("p", null, this.props.x, " + ", this.props.y, " = ", this.props.x + this.props.y);
    }, MyClass;
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
var DOMClass = function() {
    "use strict";
    function DOMClass(props) {
        _class_call_check(this, DOMClass), this.props = props;
    }
    return DOMClass.prototype.render = function() {
        return predom("p", null, this.props.x, " + ", this.props.y, " = ", this.props.x + this.props.y);
    }, DOMClass;
}();
