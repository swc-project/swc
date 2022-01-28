function getElementKey(element, index) {
    if ("object" == typeof element && null !== element && null != element.key) {
        var escaperLookup;
        return escaperLookup = {
            "=": "=0",
            ":": "=2"
        }, "$" + ("" + element.key).replace(/[=:]/g, function(match) {
            return escaperLookup[match];
        });
    }
    return index.toString(36);
}
