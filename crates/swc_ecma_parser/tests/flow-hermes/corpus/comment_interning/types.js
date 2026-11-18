type Test1 = /* 1.1 L generic */ Foo /* 1.2 T generic */ . /* 1.3 L generic */ bar /* 1.4 T generic */;

type Test2</* 2.1 L variance */ + /* 2.2 L tparam */ T /* 2.3 T tparam */ : /* 2.4 L bound */ Bound /* 2.5 T bound */ = /* 2.5 L default */ Default /* 2.6 T default */ > = T;

type Test3 = /* 3.1 L nullable */ ? /* 3.2 L generic */ T /* 3.3 T generic */;

type Test4 = /* 4.1 L typeof */ typeof /* 4.2 L generic */ T /* 4.3 T generic */;

type Test5 = /* 5.1 L tuple */ [ /* 5.2 L generic */ T /* 5.3 T generic */ ] /* 5.4 T tuple */;

type Test6 = /* 6.1 L generic */ T /* 6.2 T generic */ [] /* 6.3 T array */;

type Test7 = /* 7.1 L string lit */ 'foo' /* 7.2 T string lit */;

type Test8 = /* 8.1 L num lit */ 1 /* 8.2 T num lit */;

type Test9 = /* 9.1 L bigint lit */ 1n /* 9.2 T bigint lit */;

type Test10 = /* 10.1 L bool lit */ true /* 10.2 T bool lit */;

type Test11 = /* 11.1 L interface */ interface /* 11.2 L obj */ {} /* 11.3 T obj */;

type Test12 =
  /* 12.1 L union */
  | /* 12.2 L generic */ A /* 12.3 T generic */
  | /* 12.4 L generic */ B /* 12.5 T generic */;

type Test13 =
  /* 13.1 L intersection */
  & /* 13.2 L generic */ A /* 13.3 T generic */
  & /* 13.4 L generic */ B /* 13.5 T generic */;

type Test14 =
  /* 14.1 L any */ any /* 14.2 T any */
  | /* 14.3 L mixed */ mixed /* 14.4 T mixed */
  | /* 14.5 L empty */ empty /* 14.6 T empty */
  | /* 14.7 L void */ void /* 14.8 T void */
  | /* 14.9 L null */ null /* 14.10 T null */
  | /* 14.11 L number */ number /* 14.12 T number */
  | /* 14.13 L bigint */ bigint /* 14.14 T bigint */
  | /* 14.15 L string */ string /* 14.16 T string */
  | /* 14.17 L boolean */ boolean /* 14.18 T boolean */
  | /* 14.19 L symbol */ symbol /* 14.20 T symbol */
  | /* 14.21 L exists */ * /* 14.22 T exists */;

type Test15 = /* 15.1 L id */ Foo /* 15.2 L targs */ <T> /* 15.3 T targs */;

type Test16 = Foo /* 16.1 T id */
  /* 16.2 L targs */ <T>;

type Test17 = Foo</* 17.1 I targs */>;

type Test18 = Foo<a, /* 18.1 I targs */>;
