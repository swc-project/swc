class Foo {
    bar() {
        super.bar.apply(this, [
            arg1,
            arg2
        ].concat(_to_consumable_array(args)));
    }
}
