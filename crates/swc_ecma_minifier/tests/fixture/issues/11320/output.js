// Empty class expression should be removed
// Class with side effects in computed key should NOT be removed
new class {
    [console.log("side effect")]() {}
}, // Class with property initializer with side effects should NOT be removed
new class {
    prop = console.log("side effect");
}, // Class with static block should NOT be removed if static block has side effects
new class {
    static{
        console.log("side effect");
    }
};
