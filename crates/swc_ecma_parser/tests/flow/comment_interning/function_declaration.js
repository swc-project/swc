/* 1.1 L func */ async /* 1.2 L func */ function /* 1.3 L func */ * /* 1.4 L id */ test /* 1.5 L params */ () /* 1.6 L block */ {} /* 1.7 T block */

export default function /* 2.1 L params */ () /* 2.2 L block */ {}

function /* 3.1 L id */ name /* 3.2 L tparams */ <T> /* 3.3 L params */ () {}

function name() /* 4.1 T params */ : /* 4.2 L any */ any /* 4.3 L block */ {}

function name(): /* 5.1 L pred */ %checks /* 5.2 L block */ {}

function name(): /* 6.1 L pred */ %checks /* 6.2 L pred */ (true) /* 6.3 L block */ {}

function name(): boolean /* 7.1 L pred */ %checks /* 7.2 L block */ {}

{
  /* 8.1 L func decl */ function name() {} /* 8.2 T block */
  /* 8.3 L func decl */ function name() {}
  /* 8.4 T block */
}

function name() {} /* 9.1 L func */ function name() {} /* 9.2 T block */

function name(/* 10.1 L rest param */ ... /* 10.2 L id */ x /* 10.3 T id */ ) {}

function /* 11.1 L id */ foo /* 11.2 L tparams */ <T> /* 11.3 L params */ () /* 11.4 T params */ : /* 11.5 L any */ any /* 11.6 L block */ {}

function /* 12.1 L id */ foo /* 12.2 T id */
  /* 12.3 L tparams */ <T> /* 12.4 T tparams */
  /* 12.5 L params */ () /* 12.6 T params */
  /* 12.7 T params */ : /* 12.8 L any */ any /* 12.9 T any */
  /* 12.10 L pred */ %checks /* 12.11 T pred */
  /* 12.12 L block */ {}

function /* 13.1 L id */ foo /* 13.2 T id */
  /* 13.3 L params */ () /* 13.4 T params */
  : /* 13.5 L any */ any /* 13.6 T any */
  /* 13.7 L block */ {}

function /* 14.1 L id */ foo /* 14.2 T id */
  /* 14.3 L params */ () /* 14.4 T params */
  /* 14.5 L block */ {}

function foo() { /* 15.1 I block */ }

function foo(/* 16.1 I params */) {}

function foo(a, /* 17.1 I params */) {}
