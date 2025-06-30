//// [tsxAttributeResolution12.tsx]
//// [react.d.ts]
//// [file.tsx]
// Errors correctly
var T = TestMod.Test;
var t1 = <T/>;
// Should error
var t2 = <TestMod.Test/>;
