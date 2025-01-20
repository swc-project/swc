/* 1.1 L id */ foo /* 1.2 L targs */ <T> /* 1.3 L args */ (/* 1.4 L num */ 1 /* 1.5 T num */) /* 1.6 T args */;

foo</* 2.1 L any */ any /* 2.2 T any */, /* 2.3 L implicit */ _ /* 2.4 T implicit */>();

/* 3.1 L id */ foo /* 3.2 T id */
  /* 3.3 L args */ () /* 3.4 T args */

/* 4.1 L id */ foo /* 4.2 T id */
  /* 4.3 L targs */ <T> /* 4.4 T targs */
  /* 4.5 L args */ () /* 4.6 T args */

foo(/* 5.1 I args */);

foo(a, /* 6.1 I args */);

foo</* 7.1 I targs */>();

foo<a, /* 8.1 I targs */>();
