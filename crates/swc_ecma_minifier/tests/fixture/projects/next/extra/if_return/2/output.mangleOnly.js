export function insertRule(a, b) {
    invariant(isString(a), "`insertRule` accepts only strings");
    if (!this._isBrowser) {
        if (typeof b !== "number") {
            b = this._serverSheet.cssRules.length;
        }
        this._serverSheet.insertRule(a, b);
        return this._rulesCount++;
    }
    if (this._optimizeForSpeed) {
        var c = this.getSheet();
        if (typeof b !== "number") {
            b = c.cssRules.length;
        }
        try {
            c.insertRule(a, b);
        } catch (d) {
            if (!isProd) {
                console.warn("StyleSheet: illegal rule: \n\n" + a + "\n\nSee https://stackoverflow.com/q/20007992 for more info");
            }
            return -1;
        }
    } else {
        var e = this._tags[b];
        this._tags.push(this.makeStyleTag(this._name, a, e));
    }
    return this._rulesCount++;
}
