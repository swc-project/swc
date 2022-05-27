var c = "propname";
const a = {
    some_prop: c
};
const b = console;
b.log(a);
Object.defineProperty(a, "some_prop", {
    value: 3
});
Object.defineProperty(b, "lag", {
    value: 3
});
Object.defineProperty(console, "lag", {
    value: 3
});
