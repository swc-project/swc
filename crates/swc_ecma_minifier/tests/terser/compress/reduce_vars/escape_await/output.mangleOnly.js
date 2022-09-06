function n() {
    var n;
    e().then((o) => {
        n = o;
    });
    e().then((o) => {
        if (n !== (n = o)) console.log("FAIL");
        else console.log("PASS");
    });
}
function o() {}
async function e() {
    return await o;
}
n();
