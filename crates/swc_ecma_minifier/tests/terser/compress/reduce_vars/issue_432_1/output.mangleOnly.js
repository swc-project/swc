const a = ()=>{
    b();
};
function b() {
    const a = ()=>{
        var a = ()=>{
            b();
        };
    };
    a();
}
leak(()=>Topology);
console.log("PASS");
