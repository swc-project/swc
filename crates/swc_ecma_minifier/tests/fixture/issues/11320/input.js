// Empty class expression should be removed
new class {};

// Class with only a method should also be removed (no side effects)
new class {
    foo() {}
};

// Stored result should be removed if unused
let x = new class {};

// Class with side effects in computed key should NOT be removed
new class {
    [console.log("side effect")]() {}
};

// Class with property initializer with side effects should NOT be removed
new class {
    prop = console.log("side effect");
};

// Class with static block should NOT be removed if static block has side effects
new class {
    static {
        console.log("side effect");
    }
};
