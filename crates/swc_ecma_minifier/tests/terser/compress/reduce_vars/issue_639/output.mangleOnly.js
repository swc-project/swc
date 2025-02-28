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
function t(t) {
    let n;
    if (!n) {
        n = e(t);
    }
    return n;
}
function e(t) {
    return n.extname(t);
}
getExtFn()("name");
