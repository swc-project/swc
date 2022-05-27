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
function b(b) {
    let a;
    if (!a) {
        a = c(b);
    }
    return a;
}
function c(b) {
    return a.extname(b);
}
getExtFn()("name");
