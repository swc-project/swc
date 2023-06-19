function test(foo) {
    var _foo, _foo_bar, _foo1, _foo2, _foo3, _foo_bar1, _foo4, _foo_bar2, _foo5, _foo_bar3, _foo_bar4, _foo6, _foo_bar_baz, _foo_bar5, _foo_bar_baz1, _foo_bar6, _foo7;
    (_foo = foo) === null || _foo === void 0 ? void 0 : _foo.bar;
    (_foo1 = foo) === null || _foo1 === void 0 ? void 0 : (_foo_bar = _foo1.bar) === null || _foo_bar === void 0 ? void 0 : _foo_bar.baz;
    (_foo2 = foo) === null || _foo2 === void 0 ? void 0 : _foo2(foo);
    (_foo3 = foo) === null || _foo3 === void 0 ? void 0 : _foo3.bar();
    (_foo_bar1 = (_foo4 = foo).bar) === null || _foo_bar1 === void 0 ? void 0 : _foo_bar1.call(_foo4, foo.bar, false);
    (_foo5 = foo) === null || _foo5 === void 0 ? void 0 : (_foo_bar2 = _foo5.bar) === null || _foo_bar2 === void 0 ? void 0 : _foo_bar2.call(_foo5, foo.bar, true);
    (_foo_bar3 = foo.bar) === null || _foo_bar3 === void 0 ? void 0 : _foo_bar3.baz(foo.bar, false);
    (_foo6 = foo) === null || _foo6 === void 0 ? void 0 : (_foo_bar4 = _foo6.bar) === null || _foo_bar4 === void 0 ? void 0 : _foo_bar4.baz(foo.bar, true);
    (_foo_bar5 = foo.bar) === null || _foo_bar5 === void 0 ? void 0 : (_foo_bar_baz = _foo_bar5.baz) === null || _foo_bar_baz === void 0 ? void 0 : _foo_bar_baz.call(_foo_bar5, foo.bar, false);
    (_foo7 = foo) === null || _foo7 === void 0 ? void 0 : (_foo_bar6 = _foo7.bar) === null || _foo_bar6 === void 0 ? void 0 : (_foo_bar_baz1 = _foo_bar6.baz) === null || _foo_bar_baz1 === void 0 ? void 0 : _foo_bar_baz1.call(_foo_bar6, foo.bar, true);
}
