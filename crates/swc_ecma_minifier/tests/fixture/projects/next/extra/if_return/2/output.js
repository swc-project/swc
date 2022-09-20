export function insertRule(rule, index) {
    invariant(isString(rule), "`insertRule` accepts only strings");
    if (!this._isBrowser) return "number" != typeof index && (index = this._serverSheet.cssRules.length), this._serverSheet.insertRule(rule, index), this._rulesCount++;
    if (this._optimizeForSpeed) {
        var sheet = this.getSheet();
        "number" != typeof index && (index = sheet.cssRules.length);
        try {
            sheet.insertRule(rule, index);
        } catch (error) {
            isProd || console.warn("StyleSheet: illegal rule: \n\n" + rule + "\n\nSee https://stackoverflow.com/q/20007992 for more info");
            return -1;
        }
    } else {
        var insertionPoint = this._tags[index];
        this._tags.push(this.makeStyleTag(this._name, rule, insertionPoint));
    }
    return this._rulesCount++;
}
