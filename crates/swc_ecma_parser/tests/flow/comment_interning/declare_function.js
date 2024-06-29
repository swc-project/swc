/* 1.1 func decl */ declare /* 1.2 func decl */ function name(): void; /* 1.3 T func decl */

declare function /* 2.1 L id */ name /* 2.2 L tparams */ <T> /* 2.3 L params */ () /* 2.4 T params */ : /* 2.5 T void */ void /* 2.6 T void */;

{
  /* 3.1 L decl */ declare function name(): void /* 3.2 T void */
  /* 3.3 L decl */ declare function name(): void
  /* 3.4 T void */
}

{
  /* 4.1 L decl */ declare function name(): void %checks /* 4.2 T pred */
  /* 4.3 L decl */ declare function name(): void %checks
  /* 4.4 T pred */
}

declare function Foo /* 5.1 T id */
  /* 5.2 L tparams */ <T> /* 5.3 T tparams */
  /* 5.4 L params */ (): void;

declare function Foo(): void /* 6.1 T void */
  /* 6.2 L pred */ %checks;
