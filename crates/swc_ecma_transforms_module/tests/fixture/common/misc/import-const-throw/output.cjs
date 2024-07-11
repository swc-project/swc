"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Foo = 42;
Bar = 43;
Baz = 44;
({ Foo } = {});
({ Bar } = {});
({ Baz } = {});
({ prop: Foo } = {});
({ prop: Bar } = {});
({ prop: Baz } = {});
