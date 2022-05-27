var a = {
    p: "FAIL"
};
Object.defineProperty(a, "p", {
    get: function() {
        return "PASS";
    }
});
console.log(a.p);
