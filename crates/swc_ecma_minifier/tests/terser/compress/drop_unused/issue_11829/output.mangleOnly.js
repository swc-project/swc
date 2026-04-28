function e(e) {
    let { cb: r } = e;
    if (!r) {
        r = ()=>true;
    }
    return r("value");
}
e({
    cb (e) {
        if (e === undefined) {
            throw new Error("missing argument");
        }
        console.log("PASS");
        return true;
    }
});
