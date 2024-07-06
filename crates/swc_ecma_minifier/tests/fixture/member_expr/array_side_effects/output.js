// Out of bounds
f(void 0), f(void 0), f(void 0), f(void 0), f((x(), void y())), f((x(), void y())), // Invalid property
f(void 0), f(void 0), f((x(), void y())), f((x(), void y())), // Valid property
f([].push), f([].push), f([
    x(),
    y()
].push), f([
    x(),
    y()
].push);
