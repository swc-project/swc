var Foo = function(Foo) {
    Foo[Foo["a"] = (class {
        constructor(b){
            this.b = b;
        }
    }, 0)] = "a";
    return Foo;
}(Foo || {});
