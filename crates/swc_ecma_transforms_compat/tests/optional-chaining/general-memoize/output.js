function test(foo) {
    var _foo, _foo_bar, _foo1, _foo2, _foo3, _foo_bar1, _object, _foo_bar2, _object1, _foo_bar3, _foo_bar4, _foo4, _foo_bar_baz, _object2, _foo_bar_baz1, _object3, _foo5;
    (_foo = foo) === null || _foo === void 0 ? void 0 : _foo.bar;
    (_foo_bar = (_foo1 = foo) === null || _foo1 === void 0 ? void 0 : _foo1.bar) === null || _foo_bar === void 0 ? void 0 : _foo_bar.baz;
    (_foo2 = foo) === null || _foo2 === void 0 ? void 0 : _foo2(foo);
    (_foo3 = foo) === null || _foo3 === void 0 ? void 0 : _foo3.bar();
    (_foo_bar1 = (_object = foo).bar) === null || _foo_bar1 === void 0 ? void 0 : _foo_bar1.call(_object, foo.bar, false);
    (_object1 = foo) === null || _object1 === void 0 ? void 0 : (_foo_bar2 = _object1.bar) === null || _foo_bar2 === void 0 ? void 0 : _foo_bar2.call(_object1, foo.bar, true);
    (_foo_bar3 = foo.bar) === null || _foo_bar3 === void 0 ? void 0 : _foo_bar3.baz(foo.bar, false);
    (_foo_bar4 = (_foo4 = foo) === null || _foo4 === void 0 ? void 0 : _foo4.bar) === null || _foo_bar4 === void 0 ? void 0 : _foo_bar4.baz(foo.bar, true);
    (_object2 = foo.bar) === null || _object2 === void 0 ? void 0 : (_foo_bar_baz = _object2.baz) === null || _foo_bar_baz === void 0 ? void 0 : _foo_bar_baz.call(_object2, foo.bar, false);
    (_object3 = (_foo5 = foo) === null || _foo5 === void 0 ? void 0 : _foo5.bar) === null || _object3 === void 0 ? void 0 : (_foo_bar_baz1 = _object3.baz) === null || _foo_bar_baz1 === void 0 ? void 0 : _foo_bar_baz1.call(_object3, foo.bar, true);
}
