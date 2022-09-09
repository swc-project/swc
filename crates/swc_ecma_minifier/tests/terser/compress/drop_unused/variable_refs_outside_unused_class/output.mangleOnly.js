var o = id({ prop: "method" });
var p = id({ prop: class {} });
var r = id({ prop: "foo" });
class s extends p.prop {
    static prop = r.prop;
    [o.prop]() {
        console.log("PASS");
    }
}
console.log("PASS");
