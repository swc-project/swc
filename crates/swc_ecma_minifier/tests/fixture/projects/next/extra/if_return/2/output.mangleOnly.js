export function insertRule(e, t) {
    invariant(isString(e), "`insertRule` accepts only strings");
    if (!this._isBrowser) {
        if (typeof t !== "number") {
            t = this._serverSheet.cssRules.length;
        }
        this._serverSheet.insertRule(e, t);
        return this._rulesCount++;
    }
    if (this._optimizeForSpeed) {
        var s = this.getSheet();
        if (typeof t !== "number") {
            t = s.cssRules.length;
        }
        try {
            s.insertRule(e, t);
        } catch (i) {
            if (!isProd) {
                console.warn("StyleSheet: illegal rule: \n\n" + e + "\n\nSee https://stackoverflow.com/q/20007992 for more info");
            }
            return -1;
        }
    } else {
        var r = this._tags[t];
        this._tags.push(this.makeStyleTag(this._name, e, r));
    }
    return this._rulesCount++;
}
