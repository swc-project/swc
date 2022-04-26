import * as swcHelpers from "@swc/helpers";
var _link = /*#__PURE__*/ new WeakSet();
export class Node {
    link() {
        swcHelpers.classPrivateMethodGet(this, _link, link).call(this, this);
    }
    constructor(){
        swcHelpers.classPrivateMethodInit(this, _link);
        this.childNodes = [];
    }
}
function link(parent) {
    this.parent = parent;
    for (const childNode of this.childNodes){
        swcHelpers.classPrivateMethodGet(childNode, _link, link).call(childNode, this);
    }
}
