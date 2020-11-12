const _i = function() {
    function a(...d) {
        return d.join(" ");
    }
    return {
        a
    };
}();
const _j = function() {
    function a(...d) {
        return d.join("/");
    }
    return {
        a
    };
}();
const k = globalThis.value ? _i : _j;
const { a ,  } = k;
const a1 = a;
export { a1 as a, b };
