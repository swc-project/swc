//// [globalThisUnknownNoImplicitAny.ts]
// all accesses should be errors
win.hi, this.hi, win.hi, this.hi;
