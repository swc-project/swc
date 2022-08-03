const n = ()=>{
    o();
};
function o() {
    function n() {
        var n = ()=>{
            o();
        };
        leak(n);
    }
    n();
}
leak(()=>Topology);
console.log("PASS");
