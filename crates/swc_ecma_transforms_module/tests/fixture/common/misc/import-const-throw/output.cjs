"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _foo = _interopRequireDefault(require("foo"));
const _bar = _interopRequireWildcard(require("bar"));
const _baz = require("baz");
Foo = 42;
Bar = 43;
Baz = 44;
({ Foo  } = {});
({ Bar  } = {});
({ Baz  } = {});
({ prop: Foo  } = {});
({ prop: Bar  } = {});
({ prop: Baz  } = {});
