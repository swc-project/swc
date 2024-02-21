//// [logicalAssignment2.ts]
a.baz &&= result.baz, b.baz ||= result.baz, c.baz ??= result.baz, a.foo.baz &&= result.foo.baz, b.foo.baz ||= result.foo.baz, c.foo.baz ??= result.foo.baz, a.foo.bar().baz &&= result.foo.bar().baz, b.foo.bar().baz ||= result.foo.bar().baz, c.foo.bar().baz ??= result.foo.bar().baz;
