var a = 1;
var b = {
    get "a-b"() {
        return a;
    },
    set "a-b"(c) {
        a = c;
    },
};
console.log(b["a-b"], (b["a-b"] = 2), b["a-b"]);
