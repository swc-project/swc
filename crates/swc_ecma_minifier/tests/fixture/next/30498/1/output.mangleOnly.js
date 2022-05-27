function a() {
    return new b();
}
class b extends BaseSchema {
    matches(d, a) {
        let e = false;
        let b;
        let c;
        if (a) {
            if (typeof a === "object") {
                ({ excludeEmptyString: e = false , message: b , name: c  } = a);
            } else {
                b = a;
            }
        }
        return this.test({
            name: c || "matches",
            message: b || string.matches,
            params: {
                regex: d
            },
            test: (a)=>isAbsent(a) || (a === "" && e) || a.search(d) !== -1
        });
    }
}
a.prototype = b.prototype;
