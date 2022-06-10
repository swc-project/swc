var a = {
    f: "FAIL",
    g () {
        return super.f;
    }
};
Object.setPrototypeOf(a, {
    f: "PASS"
});
console.log(a.g());
