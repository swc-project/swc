function a() {
    var a;
    c().then((b)=>{
        a = b;
    });
    c().then((b)=>{
        if (a !== (a = b)) console.log("FAIL");
        else console.log("PASS");
    });
}
function b() {}
async function c() {
    return await b;
}
a();
