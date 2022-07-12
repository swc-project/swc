// @target: esnext
// @strict: true
u.foo = 'bye';
u.baz = 'hi';
v.foo = false;
m.foo = 'hi';
m.bar;
ro.foo = 'not allowed';
num[0] = 1;
num['0'] = 'ok';
const sym = Symbol();
both['s'] = 'ok';
both[0] = 1;
both[1] = 0 // not ok
;
both[0] = 'not ok';
both[sym] = 'not ok';
