define([
    "exports",
    "foo",
    "bar",
    "baz"
], function(exports, _foo, _bar, _baz) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    _foo = _interopRequireDefault(_foo);
    _bar = _interopRequireWildcard(_bar);
    Foo = 42;
    Bar = 43;
    Baz = 44;
    ({ Foo  } = {});
    ({ Bar  } = {});
    ({ Baz  } = {});
    ({ prop: Foo  } = {});
    ({ prop: Bar  } = {});
    ({ prop: Baz  } = {});
});
