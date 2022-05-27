function a() {
    for (const a of d(c)){
        console.log(a);
    }
    function d(a) {
        return b(a);
    }
}
function b(a) {
    return [
        a,
        2 * a,
        3 * a
    ];
}
const c = 10;
a();
