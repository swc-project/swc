var tmp = Symbol.toPrimitive;
class C {
    [tmp]() {
        return "";
    }
}
