//// [globalThisUnknownNoImplicitAny.ts]
// all accesses should be errors
win.hi;
this.hi;
globalThis.hi;
win['hi'];
this['hi'];
globalThis['hi'];
