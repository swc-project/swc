const o = () => {
    n();
};
function n() {
    function o() {
        var o = () => {
            n();
        };
        leak(o);
    }
    o();
}
leak(() => Topology);
console.log("PASS");
