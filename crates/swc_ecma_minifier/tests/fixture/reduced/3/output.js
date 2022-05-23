var element = jqLite(element);
if (element.injector()) throw ngMinErr("btstrpd", "App Already Bootstrapped with this Element '{0}'", element[0] === document ? "document" : startingTag(element));
