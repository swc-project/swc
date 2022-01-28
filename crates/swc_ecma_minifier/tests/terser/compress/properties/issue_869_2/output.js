var o = { o: "FAIL" };
Object.defineProperties(o, {
    o: {
        get: function () {
            return "PASS";
        },
    },
});
console.log(o.o);
