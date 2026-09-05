function F() {
    return (function () {
        class C {
            @dec(new.target)
            method() {}
        }

        return C;
    })();
}
