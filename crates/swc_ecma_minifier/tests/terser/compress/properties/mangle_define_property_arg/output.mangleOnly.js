var e = "propname";
const r = {
    some_prop: e
};
const o = console;
o.log(r);
Object.defineProperty(r, "some_prop", {
    value: 3
});
Object.defineProperty(o, "lag", {
    value: 3
});
Object.defineProperty(console, "lag", {
    value: 3
});
