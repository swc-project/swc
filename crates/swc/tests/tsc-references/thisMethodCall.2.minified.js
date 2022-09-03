//// [thisMethodCall.ts]
class C {
    method() {}
    other() {
        var _obj, ref;
        null === (ref = (_obj = this).method) || void 0 === ref || ref.call(_obj);
    }
}
