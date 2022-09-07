var a = {
    set a(a) {
        this.b = a;
    },
    b: "FAIL",
};
a.a = "PASS";
console.log(a.b);
