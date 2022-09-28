var o = 1;
function n(t) {
    t && n();
    --o, o.toString();
}
n();
console.log(o);
