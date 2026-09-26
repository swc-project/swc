import assert from "node:assert/strict";

function replace(Base: any) {
    assert.equal(Base.name, "Key");
    return class extends Base {};
}

let keyCapture;
let heritageCapture;
@replace
class Key extends (heritageCapture = () => Key, Object) {
    [(keyCapture = () => Key, "method")]() {
        return Key;
    }
}
assert.notEqual(keyCapture(), Key);
assert.notEqual(heritageCapture(), Key);
assert.equal(new Key().method(), Key);

assert.throws(() => {
    @replace
    class Eager {
        [Eager]() {}
        static self() { return Eager; }
    }
}, ReferenceError);

assert.throws(() => {
    @replace
    class Heritage extends Heritage {
        static self() { return Heritage; }
    }
}, ReferenceError);
