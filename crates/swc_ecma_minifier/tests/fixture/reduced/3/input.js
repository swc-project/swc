var element = jqLite(element);

if (element.injector()) {
    var tag = element[0] === document ? "document" : startingTag(element);
    throw ngMinErr(
        "btstrpd",
        "App Already Bootstrapped with this Element '{0}'",
        tag
    );
}
