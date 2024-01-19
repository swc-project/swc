function getElementKey(element, index) {
    if ("object" == typeof element && null !== element && null != element.key) {
        var key, escaperLookup;
        return key = "" + element.key, escaperLookup = {
            "=": "=0",
            ":": "=2"
        }, "$" + key.replace(/[=:]/g, function(match) {
            return escaperLookup[match];
        });
    }
    return index.toString(36);
}
