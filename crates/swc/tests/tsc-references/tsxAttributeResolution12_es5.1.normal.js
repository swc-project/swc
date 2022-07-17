//@jsx: preserve
//@filename: react.d.ts
// Errors correctly
var T = TestMod.Test;
var t1 = /*#__PURE__*/ React.createElement(T, null);
// Should error
var t2 = /*#__PURE__*/ React.createElement(TestMod.Test, null);
