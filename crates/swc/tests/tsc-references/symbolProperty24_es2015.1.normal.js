let _toPrimitive = Symbol.toPrimitive;
class C {
    [_toPrimitive]() {
        return "";
    }
}
