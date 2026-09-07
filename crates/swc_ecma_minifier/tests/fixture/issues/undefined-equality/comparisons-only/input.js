console.log(it == undefined, undefined == it);
console.log(it != undefined, undefined != it);
console.log(it == void 0, void 0 == it);
console.log(it != void 1, void 1 != it);
console.log(it === undefined, undefined === it);
console.log(it !== void 0, void 0 !== it);
console.log(it < undefined, undefined > it);
function shadowed(undefined, it) {
    console.log(it == undefined, undefined == it);
    console.log(it != undefined, undefined != it);
}
shadowed(1, 1);
