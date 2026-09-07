function check(it, expected) {
    if (null == it !== expected || null == it !== expected) throw Error("loose equality");
    if (null != it === expected || null != it === expected) throw Error("loose inequality");
    if (null == it !== expected || null == it !== expected) throw Error("void equality");
    if (null != it === expected || null != it === expected) throw Error("void inequality");
}
check(void 0, true);
check(null, true);
for (const value of [
    false,
    0,
    0 / 0,
    "",
    1,
    "undefined",
    {},
    [],
    0n,
    Symbol()
])check(value, false);
function strict(it) {
    console.log(void 0 === it, void 0 === it);
    console.log(void 0 !== it, void 0 !== it);
}
strict(null);
strict(void 0);
function shadowed(undefined, it) {
    console.log(undefined == it, undefined == it);
    console.log(undefined != it, undefined != it);
}
shadowed(1, 1);
shadowed(1, null);
console.log("PASS");
