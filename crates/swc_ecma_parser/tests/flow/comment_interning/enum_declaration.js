/* 1.1 L enum */ enum /* 1.2 L id */ Foo /* 1.3 T id */ {} /* 1.4 T enum body */

/* 2.1 L enum */ enum /* 1.2 L id */ Foo /* 1.3 T id */ of string /* 1.4 L enum body */ {} /* 1.5 T enum body */

enum Foo {
  /* 3.1 L id */ Bar /* 3.2 T id */,
  /* 3.3 L id */ Baz /* 3.4 T id */,
}

enum Foo {
  /* 4.1 L id */ Bar /* 4.2 T id */ = /* 4.3 L num */ 10 /* 4.4 T num */,
}

enum Foo {
  /* 5.1 L id */ Bar /* 5.2 T id */ = /* 5.3 L bool */ true /* 5.4 T bool */,
}

{
  /* 6.1 L enum */ enum Foo {} /* 6.2 L enum */ enum Foo {} /* 6.3 T enum body */
  /* 6.4 T enum body */
}
