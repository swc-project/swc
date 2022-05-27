const a = ()=>{
    b();
};
function b() {
    function a() {
        var a = ()=>{
            b();
        };
        leak(a);
    }
    a();
}
leak(()=>Topology);
console.log("PASS");
