var a = {
    p: "FAIL"
};
Object.defineProperties(a, {
    p: {
        get: function() {
            return "PASS";
        }
    }
});
console.log(a.p);
