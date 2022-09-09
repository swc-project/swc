global.leak = (e) =>
    class l {
        get pass() {
            return e;
        }
    };
global.module = {};
(function () {
    const e = leak("PASS");
    class l extends e {}
    module.exports = l;
})();
console.log(new module.exports().pass);
