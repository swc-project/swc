var a = id({
    prop: "method"
});
var b = id({
    prop: class {
    }
});
var c = id({
    prop: "foo"
});
class d extends b.prop {
    static prop = c.prop;
    [a.prop]() {
        console.log("PASS");
    }
}
console.log("PASS");
