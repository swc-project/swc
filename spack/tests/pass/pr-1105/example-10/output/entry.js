const mod = function() {
    function a(...d) {
        return d.join(" ");
    }
    return {
        a
    };
}();
const _i = mod;
const mod1 = function() {
    function a(...d) {
        return d.join("/");
    }
    return {
        a
    };
}();
const _j = mod1;
const k = globalThis.value ? _i : _j;
const { a ,  } = k;
const a1 = a;
const a2 = a1;
export { a1 as a, b as b };
const b1 = b;
