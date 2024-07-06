function getElementKey(element, index) {
    // Do some typechecking here since we call this blindly. We want to ensure
    // that we don't block potential future ES APIs.
    if ("object" == typeof element && null !== element && null != element.key) {
        var key, escaperLookup;
        // Explicit key
        return key = "" + element.key, escaperLookup = {
            "=": "=0",
            ":": "=2"
        }, "$" + key.replace(/[=:]/g, function(match) {
            return escaperLookup[match];
        });
    } // Implicit key determined by the index in the set
    return index.toString(36);
}
