class C {
    static foo = bar;
}

(class C {
    static foo = bar;
});

class D {
    static #_ = (this.FOO = {});
}

(class D {
    static #_ = (this.FOO = {});
});
