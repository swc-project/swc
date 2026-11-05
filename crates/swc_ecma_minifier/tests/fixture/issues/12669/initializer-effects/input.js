(function () {
    let calls = 0;
    function fallback() {
        calls++;
        if (calls === 2) throw new Error("fallback");
        return calls;
    }
    globalThis.read = function (value = fallback()) { return value; };
    globalThis.calls = function () { return calls; };
})();
console.log(calls(), read(10), read(null), calls());
console.log(read(), calls());
try { read(undefined); } catch (error) { console.log(error.message, calls()); }
console.log(read(), calls());
