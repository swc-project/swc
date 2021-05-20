global.leak = (x) =>
    class dummy {
        get pass() {
            return x;
        }
    };
global.module = {};
(function () {
    const SuperClass = leak("PASS");
    class TheClass extends SuperClass {}
    module.exports = TheClass;
})();
console.log(new module.exports().pass);
