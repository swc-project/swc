!function(options) {
    let { cb } = options;
    cb || (cb = ()=>!0), cb("value");
}({
    cb (value) {
        if (void 0 === value) throw Error("missing argument");
        return console.log("PASS"), !0;
    }
});
