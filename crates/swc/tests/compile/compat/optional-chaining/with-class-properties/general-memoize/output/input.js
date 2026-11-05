function test(foo) {
    var _foo_bar, _foo_bar1, _foo_bar2, _foo_bar3, _foo_bar4, _foo_bar_baz, _foo_bar5, _foo_bar_baz1, _foo_bar6;
    foo === null || foo === void 0 ? void 0 : foo.bar;
    foo === null || foo === void 0 ? void 0 : (_foo_bar = foo.bar) === null || _foo_bar === void 0 ? void 0 : _foo_bar.baz;
    foo === null || foo === void 0 ? void 0 : foo(foo);
    foo === null || foo === void 0 ? void 0 : foo.bar();
    (_foo_bar1 = foo.bar) === null || _foo_bar1 === void 0 ? void 0 : _foo_bar1.call(foo, foo.bar, false);
    foo === null || foo === void 0 ? void 0 : (_foo_bar2 = foo.bar) === null || _foo_bar2 === void 0 ? void 0 : _foo_bar2.call(foo, foo.bar, true);
    (_foo_bar3 = foo.bar) === null || _foo_bar3 === void 0 ? void 0 : _foo_bar3.baz(foo.bar, false);
    foo === null || foo === void 0 ? void 0 : (_foo_bar4 = foo.bar) === null || _foo_bar4 === void 0 ? void 0 : _foo_bar4.baz(foo.bar, true);
    (_foo_bar5 = foo.bar) === null || _foo_bar5 === void 0 ? void 0 : (_foo_bar_baz = _foo_bar5.baz) === null || _foo_bar_baz === void 0 ? void 0 : _foo_bar_baz.call(_foo_bar5, foo.bar, false);
    foo === null || foo === void 0 ? void 0 : (_foo_bar6 = foo.bar) === null || _foo_bar6 === void 0 ? void 0 : (_foo_bar_baz1 = _foo_bar6.baz) === null || _foo_bar_baz1 === void 0 ? void 0 : _foo_bar_baz1.call(_foo_bar6, foo.bar, true);
}
