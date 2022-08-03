const n = ()=>{
    o();
};
function o() {
    const n = ()=>{
        var n = ()=>{
            o();
        };
    };
    n();
}
leak(()=>Topology);
console.log("PASS");
