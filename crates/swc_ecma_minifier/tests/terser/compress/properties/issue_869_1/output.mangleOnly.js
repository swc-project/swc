var e = {
    p: "FAIL"
};
Object.defineProperty(e, "p", {
    get: function() {
        return "PASS";
    }
});
console.log(e.p);
