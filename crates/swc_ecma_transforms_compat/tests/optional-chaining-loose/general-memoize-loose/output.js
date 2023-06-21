"use strict";
function test(foo) {
    var _foo, _foo_bar, _foo1, _foo2, _foo3, _foo_get, _foo_bar1, _foo_bar2, _foo_bar_baz, _foo_bar3, _foo_bar_baz1, _foo_bar4, _foo_bar5, _foo4, _foo_bar6, _foo5, _foo_bar7, _foo_bar8, _foo6, _foo_bar_baz2, _foo_bar9, _foo_bar_baz3, _foo_bar10, _foo7;
    (_foo = foo) == null ? void 0 : _foo.bar;
    (_foo1 = foo) == null ? void 0 : (_foo_bar = _foo1.bar) == null ? void 0 : _foo_bar.baz;
    (_foo2 = foo) == null ? void 0 : _foo2(foo);
    (_foo3 = foo) == null ? void 0 : _foo3.bar();
    (_foo_get = foo.get(bar)) == null ? void 0 : _foo_get();
    (_foo_bar1 = foo.bar()) == null ? void 0 : _foo_bar1();
    (_foo_bar2 = foo[bar]()) == null ? void 0 : _foo_bar2();
    (_foo_bar_baz = (_foo_bar3 = foo.bar()).baz) == null ? void 0 : _foo_bar_baz.call(_foo_bar3);
    (_foo_bar_baz1 = (_foo_bar4 = foo[bar]()).baz) == null ? void 0 : _foo_bar_baz1.call(_foo_bar4);
    (_foo_bar5 = (_foo4 = foo).bar) == null ? void 0 : _foo_bar5.call(_foo4, foo.bar, false);
    (_foo5 = foo) == null ? void 0 : (_foo_bar6 = _foo5.bar) == null ? void 0 : _foo_bar6.call(_foo5, foo.bar, true);
    (_foo_bar7 = foo.bar) == null ? void 0 : _foo_bar7.baz(foo.bar, false);
    (_foo6 = foo) == null ? void 0 : (_foo_bar8 = _foo6.bar) == null ? void 0 : _foo_bar8.baz(foo.bar, true);
    (_foo_bar9 = foo.bar) == null ? void 0 : (_foo_bar_baz2 = _foo_bar9.baz) == null ? void 0 : _foo_bar_baz2.call(_foo_bar9, foo.bar, false);
    (_foo7 = foo) == null ? void 0 : (_foo_bar10 = _foo7.bar) == null ? void 0 : (_foo_bar_baz3 = _foo_bar10.baz) == null ? void 0 : _foo_bar_baz3.call(_foo_bar10, foo.bar, true);
}
