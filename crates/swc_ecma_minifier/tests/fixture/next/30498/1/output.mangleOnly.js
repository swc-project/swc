export function string_create() {
    return new StringSchema();
}
export class StringSchema extends BaseSchema {
    matches(e, t) {
        let r = false;
        let s;
        let a;
        if (t) {
            if (typeof t === "object") {
                ({ excludeEmptyString: r = false , message: s , name: a  } = t);
            } else {
                s = t;
            }
        }
        return this.test({
            name: a || "matches",
            message: s || string.matches,
            params: {
                regex: e
            },
            test: (t)=>isAbsent(t) || (t === "" && r) || t.search(e) !== -1
        });
    }
}
string_create.prototype = StringSchema.prototype;
