var tmp = Symbol.toStringTag;
class C {
    [tmp]() {
        return "";
    }
}
