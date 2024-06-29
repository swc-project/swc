type Test1 = /* 1.1 L generic */ X /* 1.2 T generic */ => /* 1.3 L generic */ Y /* 1.4 T generic */;

type Test2 = /* 2.1 L params */ ( /* 2.2 L generic */ X /* 2.3 T generic */) /* 2.4 T params */ => /* 2.5 L generic */ Y /* 2.6 T generic */;

type Test3 = /* 3.1 L tparams */ <T> /* 3.2 L params */ (/* 3.3 T generic */ T /* 3.4 L generic */) /* 3.5 T params */ => T;

type Test4 = (/* 4.1 L rest param */ ... /* 4.2 L id */ X /* 4.3 T id */) => void;

type Test5 = <T> /* 5.1 T tparams */
  /* 5.2 L params */ () => void;

type Test6 = (/* 6.1 I params */) => void;

type Test7 = (any, /* 7.1 I params */) => void;
