"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _foo = /*#__PURE__*/ _interop_require_default(require("foo"));
const _bar = /*#__PURE__*/ _interop_require_wildcard(require("bar"));
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
