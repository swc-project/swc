console.log(null == it, null == it);
console.log(null != it, null != it);
console.log(null == it, null == it);
console.log(null != it, null != it);
console.log(void 0 === it, void 0 === it);
console.log(void 0 !== it, void 0 !== it);
console.log((void 0) > it, (void 0) > it);
function shadowed(undefined, it1) {
    console.log(undefined == it1, undefined == it1);
    console.log(undefined != it1, undefined != it1);
}
shadowed(1, 1);
