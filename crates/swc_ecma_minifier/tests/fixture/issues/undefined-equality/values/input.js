function check(it, expected) {
    if ((it == undefined) !== expected || (undefined == it) !== expected) {
        throw new Error("loose equality");
    }
    if ((it != undefined) === expected || (undefined != it) === expected) {
        throw new Error("loose inequality");
    }
    if ((it == void 0) !== expected || (void 1 == it) !== expected) {
        throw new Error("void equality");
    }
    if ((it != void 1) === expected || (void 0 != it) === expected) {
        throw new Error("void inequality");
    }
}
check(undefined, true);
check(null, true);
for (const value of [false, 0, NaN, "", 1, "undefined", {}, [], 0n, Symbol()]) {
    check(value, false);
}
function strict(it) {
    console.log(it === undefined, undefined === it);
    console.log(it !== void 0, void 0 !== it);
}
strict(null);
strict(undefined);
function shadowed(undefined, it) {
    console.log(it == undefined, undefined == it);
    console.log(it != undefined, undefined != it);
}
shadowed(1, 1);
shadowed(1, null);
console.log("PASS");
