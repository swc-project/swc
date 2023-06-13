function test(foo) {
    var _foo, _foo_bar, _foo1, _foo2, _foo_bar1, _object, _foo_bar2, _object1, _foo_bar3, _object2, _foo_bar_baz, _object3, _foo_bar_baz1, _object4, _foo3, _foo_bar_baz2, _object5, _foo_bar_baz3, _object6, _foo4;
    (_foo = foo) === null || _foo === void 0 ? void 0 : _foo.bar;
    (_foo_bar = (_foo1 = foo) === null || _foo1 === void 0 ? void 0 : _foo1.bar) === null || _foo_bar === void 0 ? void 0 : _foo_bar.baz;
    (_foo2 = foo) === null || _foo2 === void 0 ? void 0 : _foo2(foo);
    (_object = foo) === null || _object === void 0 ? void 0 : (_foo_bar1 = _object.bar) === null || _foo_bar1 === void 0 ? void 0 : _foo_bar1.call(_object);
    (_object1 = foo) === null || _object1 === void 0 ? void 0 : (_foo_bar2 = _object1.bar) === null || _foo_bar2 === void 0 ? void 0 : _foo_bar2.call(_object1, foo.bar, false);
    (_object2 = foo) === null || _object2 === void 0 ? void 0 : (_foo_bar3 = _object2.bar) === null || _foo_bar3 === void 0 ? void 0 : _foo_bar3.call(_object2, foo.bar, true);
    (_object3 = foo.bar) === null || _object3 === void 0 ? void 0 : (_foo_bar_baz = _object3.baz) === null || _foo_bar_baz === void 0 ? void 0 : _foo_bar_baz.call(_object3, foo.bar, false);
    (_object4 = (_foo3 = foo) === null || _foo3 === void 0 ? void 0 : _foo3.bar) === null || _object4 === void 0 ? void 0 : (_foo_bar_baz1 = _object4.baz) === null || _foo_bar_baz1 === void 0 ? void 0 : _foo_bar_baz1.call(_object4, foo.bar, true);
    (_object5 = foo.bar) === null || _object5 === void 0 ? void 0 : (_foo_bar_baz2 = _object5.baz) === null || _foo_bar_baz2 === void 0 ? void 0 : _foo_bar_baz2.call(_object5, foo.bar, false);
    (_object6 = (_foo4 = foo) === null || _foo4 === void 0 ? void 0 : _foo4.bar) === null || _object6 === void 0 ? void 0 : (_foo_bar_baz3 = _object6.baz) === null || _foo_bar_baz3 === void 0 ? void 0 : _foo_bar_baz3.call(_object6, foo.bar, true);
}
