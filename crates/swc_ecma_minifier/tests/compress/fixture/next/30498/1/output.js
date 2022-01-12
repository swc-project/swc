class StringSchema extends BaseSchema {
    matches(regex, options) {
        let excludeEmptyString = !1, message, name;
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
(function() {
    return new StringSchema();
}).prototype = StringSchema.prototype;
