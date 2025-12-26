var _bar = new WeakSet(), _baz = new WeakSet();
export class Node {
    foo() {
        bar.call(this, this);
    }
    constructor(){
        _bar.add(this);
        _baz.add(this);
    }
}
function bar(parent) {
    baz.call(parent, this);
    baz.call(parent.baz, this);
}
function baz(child) {}
