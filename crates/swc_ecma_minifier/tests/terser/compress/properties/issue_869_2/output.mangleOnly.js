var e = {
    p: "FAIL"
};
Object.defineProperties(e, {
    p: {
        get: function() {
            return "PASS";
        }
    }
});
console.log(e.p);
