var e = {
    f: "FAIL",
    g() {
        return super.f;
    },
};
Object.setPrototypeOf(e, { f: "PASS" });
console.log(e.g());
