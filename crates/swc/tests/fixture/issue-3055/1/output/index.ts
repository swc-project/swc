function _checkPrivateRedeclaration(obj, privateCollection) {
    if (privateCollection.has(obj)) {
        throw new TypeError("Cannot initialize the same private elements twice on an object");
    }
}
function _classPrivateMethodGet(receiver, privateSet, fn) {
    if (!privateSet.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return fn;
}
function _classPrivateMethodInit(obj, privateSet) {
    _checkPrivateRedeclaration(obj, privateSet);
    privateSet.add(obj);
}
var _link = new WeakSet();
export class Node {
    link() {
        _classPrivateMethodGet(this, _link, link).call(this, this);
    }
    constructor(){
        _classPrivateMethodInit(this, _link);
        this.childNodes = [];
    }
}
function link(parent) {
    this.parent = parent;
    for (const childNode of this.childNodes){
        _classPrivateMethodGet(childNode, _link, link).call(childNode, this);
    }
}
