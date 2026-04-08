var Foo = function(Foo) {
    Foo[Foo["a"] = (()=>{
        let Bar = /*#__PURE__*/ function(Bar) {
            Bar["a"] = "a";
            Bar["b"] = "b";
            return Bar;
        }({});
        return 0;
    })()] = "a";
    return Foo;
}(Foo || {});
