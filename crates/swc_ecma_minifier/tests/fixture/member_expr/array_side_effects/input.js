// Out of bounds
f([][-1]);
f([][1]);
f([][[]]);
f([][0+[]]);

f([x(), 2, 'a', 1+1, y()][-1]);
f([x(), 2, 'a', 1+1, y()][10]);

// Invalid property
f([].invalid);
f([]["invalid"]);

f([x(), 2, 'a', 1+1, y()].invalid);
f([x(), 2, 'a', 1+1, y()]["invalid"]);

// Valid property
f([].push);
f([]["push"]);

f([x(), 2, 'a', 1+1, y()].push);
f([x(), 2, 'a', 1+1, y()]["push"]);
