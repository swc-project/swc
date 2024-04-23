//// [intersectionTypeMembers.ts]
// An intersection type has those members that are present in any of its constituent types,
// with types that are intersections of the respective members in the constituent types
var abc;
abc.a = "hello";
abc.b = "hello";
abc.c = "hello";
var xyz;
xyz.x.a = "hello";
xyz.x.b = "hello";
xyz.x.c = "hello";
var f;
var s = f("hello");
var n = f(42);
var de = {
    nested: {
        doublyNested: {
            d: 'yes',
            f: 'no'
        },
        different: {
            e: 12
        },
        other: {
            g: 101
        }
    }
};
var defg = {
    nested: {
        doublyNested: {
            d: 'yes',
            f: 'no',
            g: 'ok',
            h: 'affirmative'
        },
        different: {
            e: 12
        },
        other: {
            g: 101
        }
    }
};
