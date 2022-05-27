var a = jqLite(a);
if (a.injector()) {
    var b = a[0] === document ? "document" : startingTag(a);
    throw ngMinErr("btstrpd", "App Already Bootstrapped with this Element '{0}'", b);
}
