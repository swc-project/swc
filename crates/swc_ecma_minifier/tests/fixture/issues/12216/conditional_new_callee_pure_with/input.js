function A(n) {
    this.value = "A" + n;
}

let flag = true;
const box = {
    get C() {
        flag = false;
        return A;
    },
};

with (box) {
    console.log((flag ? new C(1) : new C(2)).value, flag);
}
