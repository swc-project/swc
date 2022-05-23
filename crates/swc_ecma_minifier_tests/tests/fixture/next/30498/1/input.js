function string_create() {
    return new StringSchema();
}
class StringSchema extends BaseSchema {
    matches(regex, options) {
        let excludeEmptyString = false;
        let message;
        let name;

        if (options) {
            if (typeof options === "object") {
                ({ excludeEmptyString = false, message, name } = options);
            } else {
                message = options;
            }
        }

        return this.test({
            name: name || "matches",
            message: message || string.matches,
            params: {
                regex,
            },
            test: (value) =>
                isAbsent(value) ||
                (value === "" && excludeEmptyString) ||
                value.search(regex) !== -1,
        });
    }
}
string_create.prototype = StringSchema.prototype;
