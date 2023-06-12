"use strict";
function test(foo) {
    var _foo, _foo_bar, _foo1, _foo2, _foo_bar1, _object, _foo_get, _foo_bar2, _foo_bar3, _foo_bar_baz, _object1, _foo_bar_baz1, _object2, _foo_bar4, _object3, _foo_bar5, _object4, _foo_bar_baz2, _object5, _foo_bar_baz3, _object6, _foo3, _foo_bar_baz4, _object7, _foo_bar_baz5, _object8, _foo4;
    (_foo = foo) == null ? void 0 : _foo.bar;
    (_foo_bar = (_foo1 = foo) == null ? void 0 : _foo1.bar) == null ? void 0 : _foo_bar.baz;
    (_foo2 = foo) == null ? void 0 : _foo2(foo);
    (_object = foo) == null ? void 0 : (_foo_bar1 = _object.bar) == null ? void 0 : _foo_bar1.call(_object);
    (_foo_get = foo.get(bar)) == null ? void 0 : _foo_get();
    (_foo_bar2 = foo.bar()) == null ? void 0 : _foo_bar2();
    (_foo_bar3 = foo[bar]()) == null ? void 0 : _foo_bar3();
    (_object1 = foo.bar()) == null ? void 0 : (_foo_bar_baz = _object1.baz) == null ? void 0 : _foo_bar_baz.call(_object1);
    (_object2 = foo[bar]()) == null ? void 0 : (_foo_bar_baz1 = _object2.baz) == null ? void 0 : _foo_bar_baz1.call(_object2);
    (_object3 = foo) == null ? void 0 : (_foo_bar4 = _object3.bar) == null ? void 0 : _foo_bar4.call(_object3, foo.bar, false);
    (_object4 = foo) == null ? void 0 : (_foo_bar5 = _object4.bar) == null ? void 0 : _foo_bar5.call(_object4, foo.bar, true);
    (_object5 = foo.bar) == null ? void 0 : (_foo_bar_baz2 = _object5.baz) == null ? void 0 : _foo_bar_baz2.call(_object5, foo.bar, false);
    (_object6 = (_foo3 = foo) == null ? void 0 : _foo3.bar) == null ? void 0 : (_foo_bar_baz3 = _object6.baz) == null ? void 0 : _foo_bar_baz3.call(_object6, foo.bar, true);
    (_object7 = foo.bar) == null ? void 0 : (_foo_bar_baz4 = _object7.baz) == null ? void 0 : _foo_bar_baz4.call(_object7, foo.bar, false);
    (_object8 = (_foo4 = foo) == null ? void 0 : _foo4.bar) == null ? void 0 : (_foo_bar_baz5 = _object8.baz) == null ? void 0 : _foo_bar_baz5.call(_object8, foo.bar, true);
}
