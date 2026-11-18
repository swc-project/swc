type Test1 = /* 1.1 L obj */ {} /* 1.2 T obj */;

type Test2 = {/* 2.1 L variance */ + /* 2.2 L id */ x /* 2.3 T id */: 1};

type Test3 = {/* 3.1 L indexer */ [ /* 3.2 L type */ string /* 3.3 T type */]: /* 3.4 L type */ string /* 3.5 T type */};

type Test4 = {/* 4.1 L variance */ + /* 4.2 L indexer */ [string] /* 4.3 T indexer */ : string };

type Test5 = {/* 5.1 L spread */ ... /* 5.2 L obj */ {} /* 5.3 T obj */};

type Test6 = {/* 6.1 L islot */ [[ /* 6.2 L id */ foo /* 6.3 T id */]] /* 6.4 T islot */ : /* 6.5 L type */ string /* 6.6 T type */};

type Test7 = {/* 7.1 L params */ (/* 7.2 L generic */ X /* 7.3 T generic */) /* 7.4 T params */ : /* 7.5 L generic */ Y /* 7.6 T generic */ };

type Test8 = {/* 8.1 L tparams */ <T> /* 8.2 L params */ () /* 8.3 T params */: void};

type Test9 = {/* 9.1 L id */ method /* 9.2 L tparams */ <T> /* 9.3 L params */ () /* 9.4 T params */: void};

type Test10 = {/* 10.1 L islot */ [[key]] /* 10.2 L tparams */ <T> /* 10.3 L params */ () /* 10.4 T params */: void}

declare class PrefixTests {
  /* 11.1 L prop */ static /* 11.2 L id */ prop: any,

  /* 12.1 L prop */ proto /* 12.2 L id */ prop: any,

  /* 13.1 L id */ static: any;

  /* 14.1 L id */ proto: any;

  /* 15.1 L prop */ static /* 15.2 L prop */ get /* 15.3 L id */ getter /* 15.4 L params */ (): void,

  /* 16.1 L prop */ static /* 16.2 L prop */ set /* 16.3 L id */ setter /* 16.4 L params */ (any): void,

  /* 17.1 L prop */ static /* 17.2 L id */ method(): void,

  /* 18.1 L call prop */ static /* 18.2 L func */ (): void,

  /* 19.1 L indexer */ static /* 19.2 L indexer */ [string]: string,

  /* 20.1 L islot */ static /* 20.2 L islot */ [[prop]]: string,

  get getter /* 21.1 T id */
    /* 21.2 L params */ (): void
}

type Test = {
  method /* 22.1 T id */
    /* 22.2 L tparams */ <T> /* 22.3 T tparams */
    /* 22.4 L params */ (): void,

  method /* 23.1 T id */
    /* 23.2 L params */ (): void,

  <T> /* 24.1 T tparams */
    /* 24.2 L params */ (): void,

  [[key]]<T> /* 25.1 T tparams */
    /* 25.2 L params */ (): void,
};

type Test = { /* 26.1 I obj */ };

type Test = { a: any, /* 27.1 I obj */ };

type Test = { a: any, /* 28.1 I obj */ ... /* 28.2 I obj */ };
