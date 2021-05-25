var o = {
    f: "FAIL",
    g() {
        return super.f;
    },
};
Object.setPrototypeOf(o, { f: "PASS" });
console.log(o.g());
