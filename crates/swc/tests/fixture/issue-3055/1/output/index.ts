function _classPrivateMethodGet(receiver, privateSet, fn) {
    if (!privateSet.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return fn;
}
var _link = new WeakSet();
export class Node {
    link() {
        _classPrivateMethodGet(this, _link, link).call(this, this);
    }
    constructor(){
        _link.add(this);
        this.childNodes = [];
    }
}
function link(parent) {
    this.parent = parent;
    for (const childNode of this.childNodes){
        _classPrivateMethodGet(childNode, _link, link).call(childNode, this);
    }
}
