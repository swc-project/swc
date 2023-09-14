//// [noPropertyAccessFromIndexSignature1.ts]
// access property
a.foo, a.foo, // access index signature
b.foo, b.foo, // access property
c.foo, c.foo, // access index signature
c.bar, c.bar, null == // optional access property
d || d.foo, null == d || d.foo, null == // optional access index signature
d || d.bar, null == d || d.bar;
