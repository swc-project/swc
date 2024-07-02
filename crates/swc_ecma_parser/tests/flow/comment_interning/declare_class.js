/* 1.1 L decl class */ declare /* 1.2 L decl class */ class Class {} /* 1.3 T obj type */

declare class /* 2.1 L id */ Class /* 2.2 L tparams */ <T> /* 2.3 L obj type */ {}

declare class Class /* 3.1 T id */ extends /* 3.2 L id */ Super /* 3.3 L obj type */ {}

declare class Class /* 4.1 T id */ implements /* 4.2 L id */ Interface /* 4.3 L obj type */ {}

declare class Class /* 5.1 T id */ mixins /* 5.2 L id */ Mixin /* 5.3 L obj type */ {}

{
  /* 6.1 L decl */ declare class Class {} /* 6.2 T obj type */
  /* 6.3 L decl */ declare class Class {}
  /* 6.4 T obj type */
}

declare class Class /* 7.1 T id */
  /* 7.2 L tparams */ <T> /* 7.3 T tparams */
  /* 7.4 L obj type */ {}

declare class Class /* 8.1 T id */
  /* 8.2 L obj type */ {}

declare class Class extends Super /* 9.1 T id */
  /* 9.2 L obj type */ {}

declare class Class implements Interface /* 10.1 T id */
  /* 10.2 L obj type */ {}

declare class Class mixins Mixin /* 11.1 T id */
  /* 11.2 L obj type */ {}
