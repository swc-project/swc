var p = id({
    prop: "method"
});
var o = id({
    prop: class {
    }
});
var r = id({
    prop: "foo"
});
class a extends o.prop {
    static prop = r.prop;
    [p.prop]() {
        console.log("PASS");
    }
}
console.log("PASS");
