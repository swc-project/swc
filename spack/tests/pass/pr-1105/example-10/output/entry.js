function a3(...d) {
    return d.join(" ");
}
const mod = function() {
    return {
        a: a3
    };
}();
function a1(...d) {
    return d.join("/");
}
const mod1 = function() {
    return {
        a: a1
    };
}();
const k = globalThis.value ? mod : mod1;
const { a: a2 ,  } = k;
export { a2 as a, b as b };
