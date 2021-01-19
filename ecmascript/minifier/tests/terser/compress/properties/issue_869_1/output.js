var o = { o: "FAIL" };
Object.defineProperty(o, "o", {
    get: function () {
        return "PASS";
    },
});
console.log(o.o);
