import { _ as _define_property } from "@swc/helpers/_/_define_property";
var _link = new WeakSet();
export class Node {
    link() {
        link.call(this, this);
    }
    constructor(){
        _link.add(this);
        _define_property(this, "childNodes", []);
        _define_property(this, "parent", void 0);
    }
}
function link(parent) {
    this.parent = parent;
    for (const childNode of this.childNodes){
        link.call(childNode, this);
    }
}
