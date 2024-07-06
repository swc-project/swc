export function insertRule(rule, index) {
    if (invariant(isString(rule), "`insertRule` accepts only strings"), !this._isBrowser) return "number" != typeof index && (index = this._serverSheet.cssRules.length), this._serverSheet.insertRule(rule, index), this._rulesCount++;
    if (this._optimizeForSpeed) {
        var sheet = this.getSheet();
        "number" != typeof index && (index = sheet.cssRules.length); // this weirdness for perf, and chrome's weird bug
        // https://stackoverflow.com/questions/20007992/chrome-suddenly-stopped-accepting-insertrule
        try {
            sheet.insertRule(rule, index);
        } catch (error) {
            return isProd || console.warn("StyleSheet: illegal rule: \n\n" + rule + "\n\nSee https://stackoverflow.com/q/20007992 for more info"), -1;
        }
    } else {
        var insertionPoint = this._tags[index];
        this._tags.push(this.makeStyleTag(this._name, rule, insertionPoint));
    }
    return this._rulesCount++;
}
