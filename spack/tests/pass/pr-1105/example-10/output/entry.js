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
const { a: a2 ,  } = k;
const a1 = a2;
export { a1 as a, b as b };
