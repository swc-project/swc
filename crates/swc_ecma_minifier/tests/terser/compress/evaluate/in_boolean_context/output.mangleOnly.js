console.log(!42, !"foo", ![
    1,
    2
], !/foo/, !b(42), !b("foo"), !b([
    1,
    2
]), !b(/foo/), ![
    1,
    foo()
], ![
    1,
    foo(),
    2
]);
