import * as swcHelpers from "@swc/helpers";
import { predom } from "./renderer2";
import prerendered from "./component";
export var MySFC = function(props) {
    return predom("p", null, props.x, " + ", props.y, " = ", props.x + props.y);
};
export var MyClass = function() {
    "use strict";
    function MyClass(props) {
        swcHelpers.classCallCheck(this, MyClass), this.props = props;
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
predom("h", null);
var DOMSFC = function(props) {
    return predom("p", null, props.x, " + ", props.y, " = ", props.x + props.y, props.children);
}, DOMClass = function() {
    "use strict";
    function DOMClass(props) {
        swcHelpers.classCallCheck(this, DOMClass), this.props = props;
    }
    return DOMClass.prototype.render = function() {
        return predom("p", null, this.props.x, " + ", this.props.y, " = ", this.props.x + this.props.y);
    }, DOMClass;
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
