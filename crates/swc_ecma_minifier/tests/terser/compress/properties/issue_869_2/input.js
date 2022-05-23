var o = { p: "FAIL" };
Object.defineProperties(o, {
    p: {
        get: function () {
            return "PASS";
        },
    },
});
console.log(o.p);
