function run(options) {
    let { cb } = options;
    if (!cb) {
        cb = () => true;
    }
    return cb("value");
}

run({
    cb(value) {
        if (value === undefined) {
            throw new Error("missing argument");
        }
        console.log("PASS");
        return true;
    }
});
