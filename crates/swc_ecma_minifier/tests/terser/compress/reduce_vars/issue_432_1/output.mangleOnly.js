const o = () => {
    n();
};
function n() {
    const o = () => {
        var o = () => {
            n();
        };
    };
    o();
}
leak(() => Topology);
console.log("PASS");
