export function insertRule(b, a) {
    invariant(isString(b), "`insertRule` accepts only strings");
    if (!this._isBrowser) {
        if (typeof a !== "number") {
            a = this._serverSheet.cssRules.length;
        }
        this._serverSheet.insertRule(b, a);
        return this._rulesCount++;
    }
    if (this._optimizeForSpeed) {
        var c = this.getSheet();
        if (typeof a !== "number") {
            a = c.cssRules.length;
        }
        try {
            c.insertRule(b, a);
        } catch (e) {
            if (!isProd) {
                console.warn("StyleSheet: illegal rule: \n\n" + b + "\n\nSee https://stackoverflow.com/q/20007992 for more info");
            }
            return -1;
        }
    } else {
        var d = this._tags[a];
        this._tags.push(this.makeStyleTag(this._name, b, d));
    }
    return this._rulesCount++;
}
