export function string_create() {
    return new StringSchema();
}
export class StringSchema extends BaseSchema {
    matches(e, t) {
        let s = false;
        let r;
        let a;
        if (t) {
            if (typeof t === "object") {
                ({ excludeEmptyString: s = false , message: r , name: a  } = t);
            } else {
                r = t;
            }
        }
        return this.test({
            name: a || "matches",
            message: r || string.matches,
            params: {
                regex: e
            },
            test: (t)=>isAbsent(t) || (t === "" && s) || t.search(e) !== -1
        });
    }
}
string_create.prototype = StringSchema.prototype;
