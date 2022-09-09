export function string_create() {
    return new StringSchema();
}
export class StringSchema extends BaseSchema {
    matches(e, t) {
        let s = false;
        let a;
        let r;
        if (t) {
            if (typeof t === "object") {
                ({ excludeEmptyString: s = false , message: a , name: r  } = t);
            } else {
                a = t;
            }
        }
        return this.test({
            name: r || "matches",
            message: a || string.matches,
            params: {
                regex: e
            },
            test: (t)=>isAbsent(t) || (t === "" && s) || t.search(e) !== -1
        });
    }
}
string_create.prototype = StringSchema.prototype;
