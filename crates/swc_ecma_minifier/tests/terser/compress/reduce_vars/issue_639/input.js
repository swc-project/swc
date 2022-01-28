const path = id({
    extname: (name) => {
        console.log("PASS:" + name);
    },
});
global.getExtFn = function getExtFn() {
    return function (path) {
        return getExt(path);
    };
};
function getExt(name) {
    let ext;
    if (!ext) {
        ext = getExtInner(name);
    }
    return ext;
}
function getExtInner(name) {
    return path.extname(name);
}
getExtFn()("name");
