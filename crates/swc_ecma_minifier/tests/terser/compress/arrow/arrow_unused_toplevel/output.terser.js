let fn = (a) => {
    console.log(a * a);
};
(() => {
    console.log("0");
})();
!(function (x) {
    (() => {
        console.log("1");
    })();
    let baz = (e) => e + e;
    console.log(baz(x));
})(1);
fn(3);
