/* 1.1 L decl */ declare /* 1.2 L decl */ export /* 1.3 L decl */ default /* 1.4 L func */ function foo(): any /* 1.5 T any */

/* 2.1 L decl */ declare /* 2.2 L decl */ export /* 2.3 L decl */ default /* 2.4 L class */ class Foo {} /* 2.5 T obj type */

/* 3.1 L decl */ declare /* 3.2 L decl */ export /* 3.3 L decl */ default /* 3.4 L any */ any; /* 3.5 T decl */

/* 4.1 L decl */ declare /* 4.2 L decl */ export /* 4.3 L func */ function foo(): any /* 4.4 T any */

/* 5.1 L decl */ declare /* 5.2 L decl */ export /* 5.3 L class */ class Foo {} /* 5.4 T obj type */

/* 6.1 L decl */ declare /* 6.2 L decl */ export /* 6.3 decl var */ var x: any; /* 6.4 T decl var */

/* 7.1 L decl */ declare /* 7.2 L decl */ export * from /* 7.3 L str */ 'source' /* 7.4 T str */; /* 7.5 T decl */

declare module Module {
  /* 8.1 L decl */ declare /* 8.2 L decl */ export /* 8.3 L alias */ type Foo = any; /* 8.4 T alias */

  /* 9.1 L decl */ declare /* 9.2 L decl */ export /* 9.3 L opaque */ opaque type Foo; /* 9.4 T opaque */

  /* 10.1 L decl */ declare /* 10.2 L decl */ export /* 10.3 L interface */ interface Foo {} /* 10.4 T obj type */
}

/* 11.1 L decl */ declare /* 11.2 L decl */ export { /* 11.3 L id */ Foo /* 11.4 T id */ } from /* 11.5 L str */ 'source' /* 11.6 T str */ ; /* 11.7 T decl */

declare module Module {
  /* 12.1 L decl */ declare export default any /* 12.2 T any */
  /* 12.3 L decl */ declare export default any
  /* 12.4 T any */
}

declare module Module {
  /* 13.1 L decl */ declare export * from 'source' /* 13.2 T str */
  /* 13.3 L decl */ declare export * from 'source'
  /* 13.4 T str */
}

declare module Module {
  /* 14.1 L decl */ declare export { Foo1 } /* 14.2 T decl */
  /* 14.3 L decl */ declare export { Foo2 }
  /* 14.4 T decl */
}

declare module Module {
  /* 15.1 L decl */ declare export { Foo3 } from 'source' /* 15.2 T str */
  /* 15.3 L decl */ declare export { Foo4 } from 'source'
  /* 15.4 T str */
}
