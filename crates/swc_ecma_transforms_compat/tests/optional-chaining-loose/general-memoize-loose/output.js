"use strict";
function test(foo) {
    var _foo, _foo_bar, _foo1, _foo2, _foo3, _foo_get, _foo_bar1, _foo_bar2, _foo_bar_baz, _object, _foo_bar_baz1, _object1, _foo_bar3, _object2, _foo_bar4, _object3, _foo_bar5, _foo_bar6, _foo4, _foo_bar_baz2, _object4, _foo_bar_baz3, _object5, _foo5;
    (_foo = foo) == null ? void 0 : _foo.bar;
    (_foo_bar = (_foo1 = foo) == null ? void 0 : _foo1.bar) == null ? void 0 : _foo_bar.baz;
    (_foo2 = foo) == null ? void 0 : _foo2(foo);
    (_foo3 = foo) == null ? void 0 : _foo3.bar();
    (_foo_get = foo.get(bar)) == null ? void 0 : _foo_get();
    (_foo_bar1 = foo.bar()) == null ? void 0 : _foo_bar1();
    (_foo_bar2 = foo[bar]()) == null ? void 0 : _foo_bar2();
    (_foo_bar_baz = (_object = foo.bar()).baz) == null ? void 0 : _foo_bar_baz.call(_object);
    (_foo_bar_baz1 = (_object1 = foo[bar]()).baz) == null ? void 0 : _foo_bar_baz1.call(_object1);
    (_foo_bar3 = (_object2 = foo).bar) == null ? void 0 : _foo_bar3.call(_object2, foo.bar, false);
    (_object3 = foo) == null ? void 0 : (_foo_bar4 = _object3.bar) == null ? void 0 : _foo_bar4.call(_object3, foo.bar, true);
    (_foo_bar5 = foo.bar) == null ? void 0 : _foo_bar5.baz(foo.bar, false);
    (_foo_bar6 = (_foo4 = foo) == null ? void 0 : _foo4.bar) == null ? void 0 : _foo_bar6.baz(foo.bar, true);
    (_object4 = foo.bar) == null ? void 0 : (_foo_bar_baz2 = _object4.baz) == null ? void 0 : _foo_bar_baz2.call(_object4, foo.bar, false);
    (_object5 = (_foo5 = foo) == null ? void 0 : _foo5.bar) == null ? void 0 : (_foo_bar_baz3 = _object5.baz) == null ? void 0 : _foo_bar_baz3.call(_object5, foo.bar, true);
}
