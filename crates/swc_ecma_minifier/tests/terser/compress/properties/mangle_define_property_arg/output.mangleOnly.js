var e = "propname";
const o = {
    some_prop: e
};
const r = console;
r.log(o);
Object.defineProperty(o, "some_prop", {
    value: 3
});
Object.defineProperty(r, "lag", {
    value: 3
});
Object.defineProperty(console, "lag", {
    value: 3
});
