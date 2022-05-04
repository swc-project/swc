function a(...d) {
    return d.join(" ");
}
const mod = {
    a: a
};
function a1(...d) {
    return d.join("/");
}
const mod1 = {
    a: a1
};
const k = globalThis.value ? mod : mod1;
const { a: a2  } = k;
export { a2 as a, b as b };
