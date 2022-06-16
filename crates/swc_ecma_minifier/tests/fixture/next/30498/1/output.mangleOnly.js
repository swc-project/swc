function a() {
    return new b();
}
class b extends BaseSchema {
    matches(a, b) {
        let c = false;
        let d;
        let e;
        if (b) {
            if (typeof b === "object") {
                ({ excludeEmptyString: c = false , message: d , name: e  } = b);
            } else {
                d = b;
            }
        }
        return this.test({
            name: e || "matches",
            message: d || string.matches,
            params: {
                regex: a
            },
            test: (b)=>isAbsent(b) || (b === "" && c) || b.search(a) !== -1
        });
    }
}
a.prototype = b.prototype;
