var r = jqLite(r);
if (r.injector()) {
    var a = r[0] === document ? "document" : startingTag(r);
    throw ngMinErr("btstrpd", "App Already Bootstrapped with this Element '{0}'", a);
}
