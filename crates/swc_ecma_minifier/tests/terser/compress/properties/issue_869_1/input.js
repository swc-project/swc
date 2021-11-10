var o = { p: "FAIL" };
Object.defineProperty(o, "p", {
    get: function () {
        return "PASS";
    },
});
console.log(o.p);
