//// [defs.d.ts]
//// [jsfile.js]
// current behavior: treat trailing `void` as optional
f1();
o1.m();
// new behavior: treat 'undefined', 'unknown', and 'any' as optional in non-strict mode
f2();
f3();
f4();
o2.m();
o3.m();
o4.m();
//// [tsfile.ts]
// current behavior: treat trailing `void` as optional
f1();
o1.m();
// no change in behavior
f2();
f3();
f4();
o2.m();
o3.m();
o4.m();
