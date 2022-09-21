export function string_create() {
    return new StringSchema();
}
export class StringSchema extends BaseSchema {
    matches(regex, options) {
        let message, name, excludeEmptyString = !1;
        return options && ("object" == typeof options ? { excludeEmptyString =!1 , message , name  } = options : message = options), this.test({
            name: name || "matches",
            message: message || string.matches,
            params: {
                regex
            },
            test: (value)=>isAbsent(value) || "" === value && excludeEmptyString || -1 !== value.search(regex)
        });
    }
}
string_create.prototype = StringSchema.prototype;
