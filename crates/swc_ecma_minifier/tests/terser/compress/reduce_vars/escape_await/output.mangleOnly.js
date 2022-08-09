function n() {
    var n;
    e().then((t)=>{
        n = t;
    });
    e().then((t)=>{
        if (n !== (n = t)) console.log("FAIL");
        else console.log("PASS");
    });
}
function t() {}
async function e() {
    return await t;
}
n();
