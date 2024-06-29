/* 1.1 L class */ class /* 1.2 L id */ C1 /* 1.3 L body */ {} /* 1.4 T body */

/* 2.1 L class */ class /* 2.2 L id */ C2 /* 2.3 L tparams */ <T> /* 2.4 L body */ {} /* 2.5 T body */

/* 3.1 L class */ class /* 3.2 L id */ C3 /* 3.3 L implements */ implements /* 3.4 L id */ A /* 3.5 L targs */ <T> /* 3.6 L body */ {} /* 3.7 T body */

/* 4.1 L class */ class /* 4.2 L id */ C4 /* 4.3 L extends */ extends /* 4.4 L id */ A /* 4.5 L targs */ <T> /* 4.6 L body */ {} /* 4.7 T body */

export default /* 5.1 L class */ class /* 5.2 L body */ {} /* 5.3 T body */

export default class /* 6.1 L tparams */ <T> /* 6.2 L body */ {}

export default class /* 7.1 L extends */ extends /* 7.2 L id */ Super /* 7.3 L body */ {}

export default class /* 8.1 L implements */ implements /* 8.2 L id */ Interface /* 8.3 L body */ {}

{
  /* 9.1 L class */ class C {} /* 9.2 T body */
  /* 9.3 L class */ class C {}
  /* 9.4 T body */
}

class C extends A /* 10.1 T id */
  /* 10.2 L targs */ <T> /* 10.3 T targs */
  /* 10.4 L implements */ implements B /* 10.5 T id */
  /* 10.6 L targs */ <T> /* 10.7 T targs */
  /* 10.8 L body */ {}

class /* 11.1 L id */ C /* 11.2 T id */
  /* 11.3 L tparams */ <T> /* 11.4 T tparams */
  /* 11.5 L extends */ extends A /* 11.6 T id */
  /* 11.7 L implements */ implements B /* 11.8 T id */
  /* 11.9 L body */ {} /* 11.10 T body */

class C /* 12.1 L tparams */ <T> /* 12.2 L extends */ extends A /* 12.3 L implements */ implements B /* 12.4 L body */ {}
