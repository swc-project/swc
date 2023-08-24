//// [intersectionTypeMembers.ts]
// An intersection type has those members that are present in any of its constituent types,
// with types that are intersections of the respective members in the constituent types
var abc, xyz, f;
abc.a = "hello", abc.b = "hello", abc.c = "hello", xyz.x.a = "hello", xyz.x.b = "hello", xyz.x.c = "hello", f("hello"), f(42);
