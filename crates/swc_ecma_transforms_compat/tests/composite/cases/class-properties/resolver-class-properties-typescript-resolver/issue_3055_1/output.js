var _bar = /*#__PURE__*/ new WeakSet(), _baz = /*#__PURE__*/ new WeakSet();
export class Node {
    foo() {
        _class_private_method_get(this, _bar, bar).call(this, this);
    }
    constructor(){
        _class_private_method_init(this, _bar);
        _class_private_method_init(this, _baz);
    }
}
function bar(parent) {
    var _parent_baz;
    _class_private_method_get(parent, _baz, baz).call(parent, this);
    _class_private_method_get(_parent_baz = parent.baz, _baz, baz).call(_parent_baz, this);
}
function baz(child) {}
