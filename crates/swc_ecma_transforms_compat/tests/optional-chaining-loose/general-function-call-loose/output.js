var _foo, _foo_bar, _object, _foo_bar1, _object1, _foo_bar2, _object2;
(_foo = foo) == null ? void 0 : _foo(foo);
(_object = foo) == null ? void 0 : (_foo_bar = _object.bar) == null ? void 0 : _foo_bar.call(_object);
(_object1 = foo) == null ? void 0 : (_foo_bar1 = _object1.bar) == null ? void 0 : _foo_bar1.call(_object1, foo.bar, false);
(_object2 = foo) == null ? void 0 : (_foo_bar2 = _object2.bar) == null ? void 0 : _foo_bar2.call(_object2, foo.bar, true);
