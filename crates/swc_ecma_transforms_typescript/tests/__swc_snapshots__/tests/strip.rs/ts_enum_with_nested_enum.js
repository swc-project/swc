var Foo = function(Foo) {
    Foo[Foo["a"] = (()=>{
        (function(Bar) {
            Bar["a"] = "a";
            Bar["b"] = "b";
        })(Bar);
        return 0;
    })()] = "a";
    return Foo;
}(Foo || {});
