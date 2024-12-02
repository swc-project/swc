//// [renderer.d.ts]
export { };
//// [renderer2.d.ts]
export { };
//// [component.tsx]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _to_consumable_array } from "@swc/helpers/_/_to_consumable_array";
var _this = this;
import { predom } from "./renderer2";
export var MySFC = function(props) {
    return predom.apply(void 0, [
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
    function MyClass(props) {
        _class_call_check(this, MyClass), this.props = props;
    }
    return MyClass.prototype.render = function() {
        return predom.apply(void 0, [
            "p",
            null,
            this.props.x,
            " + ",
            this.props.y,
            " = ",
            this.props.x + this.props.y
        ].concat(_to_consumable_array(this.props.children)));
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
//// [index.tsx]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _to_consumable_array } from "@swc/helpers/_/_to_consumable_array";
import { dom } from "./renderer";
import prerendered, { MySFC, MyClass, tree } from "./component";
