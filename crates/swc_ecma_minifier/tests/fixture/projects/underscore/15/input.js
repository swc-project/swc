function foo(a, b) {
    var aCtor = a.constructor,
        bCtor = b.constructor;
    if (
        aCtor !== bCtor &&
        !(
            _.isFunction(aCtor) &&
            aCtor instanceof aCtor &&
            _.isFunction(bCtor) &&
            bCtor instanceof bCtor
        )
    ) {
        return false;
    }
}
