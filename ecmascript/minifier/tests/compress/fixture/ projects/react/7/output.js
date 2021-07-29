function getElementKey(
    element, index
) {
    return "object" == typeof element && null !== element && null != element.key
        ? ((key = "" + element.key),
            (escaperLookup = {
                "=": "=0",
                ":": "=2",
            }),
            "$" +
            key.replace(
                /[=:]/g,
                function (
                    match
                ) {
                    return escaperLookup[match];
                }
            ))
        : index.toString(
            36
        );
    var key, escaperLookup;
}