var obj = {
    x: 1,
    method() {
        this.s = "PASS";
    },
    get g() {
        return this.x;
    },
    set s(value) {
        this.x = value;
    },
};
obj.method();
console.log(obj.g);
