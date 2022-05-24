import _class_private_method_get from "@swc/helpers/lib/_class_private_method_get.js";
import _class_private_method_init from "@swc/helpers/lib/_class_private_method_init.js";
var _link = /*#__PURE__*/ new WeakSet();
export class Node {
    link() {
        _class_private_method_get(this, _link, link).call(this, this);
    }
    constructor(){
        _class_private_method_init(this, _link);
        this.childNodes = [];
    }
}
function link(parent) {
    this.parent = parent;
    for (const childNode of this.childNodes){
        _class_private_method_get(childNode, _link, link).call(childNode, this);
    }
}
