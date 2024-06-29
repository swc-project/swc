/* 1.1 L decl mod */ declare /* 1.2 L decl mod */ module /* 1.3 L id */ Foo /* 1.4 L block */ {} /* 1.5 T block */

{
  /* 2.1 L decl */ declare module Foo {} /* 2.2 T block */
  /* 2.3 L decl */ declare module Foo {}
  /* 2.4 T block */
}

declare module Foo /* 3.1 T id */
  /* 3.2 L block */ {}

declare module "Foo" /* 4.1 T str */
  /* 4.2 L block */ {}

declare module Foo { /* 5.1 I block */ }
