var symbols = id({ prop: "method" });
var input = id({ prop: class {} });
var staticProp = id({ prop: "foo" });
class unused extends input.prop {
    static prop = staticProp.prop;
    [symbols.prop]() {
        console.log("PASS");
    }
}
console.log("PASS");
