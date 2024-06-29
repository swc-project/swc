/* 1.1 L export */ export /* 1.2 L export */ default /* 1.3 L num */ 1 /* 1.4 T num */ ; /* 1.5 T export */

/* 2.1 L export */ export /* 2.2 L export */ default /* 2.3 L func decl */ function() {} /* 2.4 T block */

/* 3.1 L export */ export {A}; /* 3.2 T export */

/* 4.1 L export */ export { /* 4.2 L id */ B /* 4.3 T id */ as /* 4.4 L id */ C /* 4.5 T id */ } from /* 4.6 L lit */ 'D' /* 4.7 T lit */; /* 4.8 T export */

/* 5.1 L export */ export * from 'Foo'; /* 5.2 T export */

/* 6.1 L export */ export type * from 'Foo'; /* 6.2 T export */

/* 7.1 L export */ export /* 7.2 L type alias */ type Foo = any; /* 7.3 T type alias */

/* 8.1 L export */ export /* 8.2 L class */ class Baz {} /* 8.3 T class body */

/* 9.1 L export */ export /* 9.2 L var decl */ const a = 1; /* 9.3 T var decl */

/* 10.1 L export */ export * from 'source' /* 10.2 T str lit */

/* 11.1 L export */ export type * from 'source' /* 11.2 T str lit */

/* 12.1 L export */ export { Foo1 } from 'source' /* 12.2 T str lit */

/* 13.1 L export */ export { Foo2 } /* 13.2 T export */

/* 14.1 L export */ export default 1 /* 14.2 T num */

/* Final L str */ 'end of tests';
