export function insertRule(rule, index) {
    invariant(isString(rule), "`insertRule` accepts only strings");

    if (!this._isBrowser) {
        if (typeof index !== "number") {
            index = this._serverSheet.cssRules.length;
        }

        this._serverSheet.insertRule(rule, index);

        return this._rulesCount++;
    }

    if (this._optimizeForSpeed) {
        var sheet = this.getSheet();

        if (typeof index !== "number") {
            index = sheet.cssRules.length;
        } // this weirdness for perf, and chrome's weird bug
        // https://stackoverflow.com/questions/20007992/chrome-suddenly-stopped-accepting-insertrule

        try {
            sheet.insertRule(rule, index);
        } catch (error) {
            if (!isProd) {
                console.warn(
                    "StyleSheet: illegal rule: \n\n" +
                        rule +
                        "\n\nSee https://stackoverflow.com/q/20007992 for more info"
                );
            }

            return -1;
        }
    } else {
        var insertionPoint = this._tags[index];

        this._tags.push(this.makeStyleTag(this._name, rule, insertionPoint));
    }

    return this._rulesCount++;
}
