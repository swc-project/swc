global.leak = (s)=>class e {
        get pass() {
            return s;
        }
    };
global.module = {};
(function() {
    const s = leak("PASS");
    class e extends s {
    }
    module.exports = e;
})();
console.log(new module.exports().pass);
