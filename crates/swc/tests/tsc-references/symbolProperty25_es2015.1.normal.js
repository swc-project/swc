let _toStringTag = Symbol.toStringTag;
class C {
    [_toStringTag]() {
        return "";
    }
}
