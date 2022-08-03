var p = id({
    prop: "method"
});
var r = id({
    prop: class {
    }
});
var o = id({
    prop: "foo"
});
class a extends r.prop {
    static prop = o.prop;
    [p.prop]() {
        console.log("PASS");
    }
}
console.log("PASS");
