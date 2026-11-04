"use strict";
function test(foo) {
    var _foo_bar, _foo_get, _foo_bar1, _foo_bar2, _foo_bar_baz, _foo_bar3, _foo_bar_baz1, _foo_bar4, _foo_bar5, _foo_bar6, _foo_bar7, _foo_bar_baz2, _foo_bar8, _foo_bar_baz3, _foo_bar9;
    foo == null ? void 0 : foo.bar;
    foo == null ? void 0 : (_foo_bar = foo.bar) == null ? void 0 : _foo_bar.baz;
    foo == null ? void 0 : foo(foo);
    foo == null ? void 0 : foo.bar();
    (_foo_get = foo.get(bar)) == null ? void 0 : _foo_get();
    (_foo_bar1 = foo.bar()) == null ? void 0 : _foo_bar1();
    (_foo_bar2 = foo[bar]()) == null ? void 0 : _foo_bar2();
    (_foo_bar_baz = (_foo_bar3 = foo.bar()).baz) == null ? void 0 : _foo_bar_baz.call(_foo_bar3);
    (_foo_bar_baz1 = (_foo_bar4 = foo[bar]()).baz) == null ? void 0 : _foo_bar_baz1.call(_foo_bar4);
    foo.bar == null ? void 0 : foo.bar.call(foo, foo.bar, false);
    foo == null ? void 0 : (_foo_bar5 = foo.bar) == null ? void 0 : _foo_bar5.call(foo, foo.bar, true);
    (_foo_bar6 = foo.bar) == null ? void 0 : _foo_bar6.baz(foo.bar, false);
    foo == null ? void 0 : (_foo_bar7 = foo.bar) == null ? void 0 : _foo_bar7.baz(foo.bar, true);
    (_foo_bar8 = foo.bar) == null ? void 0 : (_foo_bar_baz2 = _foo_bar8.baz) == null ? void 0 : _foo_bar_baz2.call(_foo_bar8, foo.bar, false);
    foo == null ? void 0 : (_foo_bar9 = foo.bar) == null ? void 0 : (_foo_bar_baz3 = _foo_bar9.baz) == null ? void 0 : _foo_bar_baz3.call(_foo_bar9, foo.bar, true);
}
