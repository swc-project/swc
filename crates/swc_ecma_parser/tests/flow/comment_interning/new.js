/* 1.1 L new */ new /* 1.2 L id */ Foo /* 1.3 L targs */ <T> /* 1.4 L args */ () /* 1.5 T args */;

new /* 2.1 L id */ Foo /* 2.2 T id */
  /* 2.3 L targs */ <T> /* 2.4 T targs */
  /* 2.5 L args */ () /* 2.6 T args */
  /* 2.7 T args */;

new /* 3.1 L id */ Foo /* 3.2 T id */
  /* 3.3 L targs */ <T> /* 3.4 T targs */
  /* 3.5 T targs */;

new /* 4.1 L id */ Foo /* 4.2 T id */
  /* 4.3 T id */;

new Foo(/* 5.1 I args */);

new Foo(a, /* 6.1 I args */);
