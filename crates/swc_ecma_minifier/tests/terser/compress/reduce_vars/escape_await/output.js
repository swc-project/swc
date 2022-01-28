function foo() {}
async function baz() {
    return await foo;
}
(function () {
    var thing;
    baz().then((x) => {
        thing = x;
    });
    baz().then((x) => {
        if (thing !== (thing = x)) console.log("FAIL");
        else console.log("PASS");
    });
})();
