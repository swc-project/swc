class a {
    method() {
        const a = "FAIL";
        return b(a, ()=>console.log(this.message()));
    }
    message() {
        return "PASS";
    }
}
function b(a, b) {
    return b(a);
}
new a().method();
