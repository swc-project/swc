function F() {
    return function() {
        return class C {
            @dec(new.target)
            method() {}
        };
    }();
}
