var a = "propname";
const b = {
    some_prop: a
};
const c = console;
c.log(b);
Object.defineProperty(b, "some_prop", {
    value: 3
});
Object.defineProperty(c, "lag", {
    value: 3
});
Object.defineProperty(console, "lag", {
    value: 3
});
