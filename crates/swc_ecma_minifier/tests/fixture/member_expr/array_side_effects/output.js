// Out of bounds
f([][-1]), f(void 0), f(void 0), f([][0 + []]), f([
    x(),
    2,
    'a',
    1 + 1,
    y()
][-1]), f((x(), void y())), // Invalid property
f(void 0), f(void 0), f((x(), void y())), f((x(), void y())), // Valid property
f([].push), f([].push), f([
    x(),
    y()
].push), f([
    x(),
    y()
].push);
