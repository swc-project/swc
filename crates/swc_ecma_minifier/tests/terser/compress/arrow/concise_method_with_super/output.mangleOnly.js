var r = {
    f: "FAIL",
    g () {
        return super.f;
    }
};
Object.setPrototypeOf(r, {
    f: "PASS"
});
console.log(r.g());
