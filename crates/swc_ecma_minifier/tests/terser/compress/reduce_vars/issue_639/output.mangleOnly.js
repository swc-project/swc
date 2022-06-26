const a = id({
    extname: (a)=>{
        console.log("PASS:" + a);
    }
});
global.getExtFn = function a() {
    return function(a) {
        return b(a);
    };
};
function b(a) {
    let b;
    if (!b) {
        b = c(a);
    }
    return b;
}
function c(b) {
    return a.extname(b);
}
getExtFn()("name");
