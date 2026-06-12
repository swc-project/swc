let obj = {
    m() {
        return C;
    },
};

class B {
    get(k) {
        return obj[k];
    }
}

class C extends B {}

console.log(1);
