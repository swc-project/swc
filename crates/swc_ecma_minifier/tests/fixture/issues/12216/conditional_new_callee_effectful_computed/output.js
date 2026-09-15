function A(n) {
    this.value = "A" + n;
}
let flag = true;
const ns = {
    C: A
};
function key() {
    flag = false;
    return "C";
}
console.log((flag ? new ns[key()](1) : new ns[key()](2)).value, flag);
