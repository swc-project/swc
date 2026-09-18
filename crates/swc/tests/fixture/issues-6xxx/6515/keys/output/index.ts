import { _ as _ts_decorate } from "@swc/helpers/_/_ts_decorate";
import assert from "node:assert/strict";
function replace(Base) {
    assert.equal(Base.name, "Key");
    return class extends Base {
    };
}
let keyCapture;
let heritageCapture;
let _Key;
let Key = class Key extends (heritageCapture = ()=>Key, Object) {
    static{
        _Key = this;
    }
    [(keyCapture = ()=>Key, "method")]() {
        return _Key;
    }
};
Key = _Key = _ts_decorate([
    replace
], Key);
assert.notEqual(keyCapture(), Key);
assert.notEqual(heritageCapture(), Key);
assert.equal(new Key().method(), Key);
assert.throws(()=>{
    let _Eager;
    let Eager = class Eager {
        static{
            _Eager = this;
        }
        [Eager]() {}
        static self() {
            return _Eager;
        }
    };
    Eager = _Eager = _ts_decorate([
        replace
    ], Eager);
}, ReferenceError);
assert.throws(()=>{
    let _Heritage;
    let Heritage = class Heritage extends Heritage {
        static{
            _Heritage = this;
        }
        static self() {
            return _Heritage;
        }
    };
    Heritage = _Heritage = _ts_decorate([
        replace
    ], Heritage);
}, ReferenceError);
