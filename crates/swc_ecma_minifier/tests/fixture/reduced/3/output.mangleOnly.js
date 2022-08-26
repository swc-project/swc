var t = jqLite(t);
if (t.injector()) {
    var r = t[0] === document ? "document" : startingTag(t);
    throw ngMinErr("btstrpd", "App Already Bootstrapped with this Element '{0}'", r);
}
