import _class_private_method_get from "@swc/helpers/src/_class_private_method_get.mjs";
import _class_private_method_init from "@swc/helpers/src/_class_private_method_init.mjs";
import _define_property from "@swc/helpers/src/_define_property.mjs";
var _link = /*#__PURE__*/ new WeakSet();
export class Node {
    link() {
        _class_private_method_get(this, _link, link).call(this, this);
    }
    constructor(){
        _class_private_method_init(this, _link);
        _define_property(this, "childNodes", []);
        _define_property(this, "parent", void 0);
    }
}
function link(parent) {
    this.parent = parent;
    for (const childNode of this.childNodes){
        _class_private_method_get(childNode, _link, link).call(childNode, this);
    }
}
