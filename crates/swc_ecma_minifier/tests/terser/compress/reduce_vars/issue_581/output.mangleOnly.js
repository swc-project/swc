class e {
    method() {
        const e = "FAIL";
        return s(e, ()=>console.log(this.message()));
    }
    message() {
        return "PASS";
    }
}
function s(e, s) {
    return s(e);
}
new e().method();
