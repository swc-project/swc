global.leak = (a)=>class b {
        get pass() {
            return a;
        }
    };
global.module = {};
(function() {
    const a = leak("PASS");
    class b extends a {
    }
    module.exports = b;
})();
console.log(new module.exports().pass);
