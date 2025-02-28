var r = "propname";
const e = {
    some_prop: r
};
const o = console;
o.log(e);
Object.defineProperty(e, "some_prop", {
    value: 3
});
Object.defineProperty(o, "lag", {
    value: 3
});
Object.defineProperty(console, "lag", {
    value: 3
});
