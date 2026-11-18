const sym = Symbol("sym");

class Cls {
    @Memoize()
    [sym]() { }
}