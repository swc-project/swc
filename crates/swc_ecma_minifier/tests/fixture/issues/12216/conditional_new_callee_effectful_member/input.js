function A(n) {
    this.value = "A" + n;
}

let flag = true;
const ns = {
    get C() {
        flag = false;
        return A;
    },
};

console.log((flag ? new ns.C(1) : new ns.C(2)).value, flag);
