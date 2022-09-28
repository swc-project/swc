const n = id({
    extname: (n)=>{
        console.log("PASS:" + n);
    }
});
global.getExtFn = function n() {
    return function(n) {
        return t(n);
    };
};
function t(n) {
    let t;
    if (!t) {
        t = e(n);
    }
    return t;
}
function e(t) {
    return n.extname(t);
}
getExtFn()("name");
