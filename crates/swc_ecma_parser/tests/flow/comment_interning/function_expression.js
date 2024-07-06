(/* 1.1 L func */ async /* 1.2 L func */ function /* 1.3 L func */ * /* 1.4 L id */ test /* 1.5 L params */ () /* 1.6 L block */ {} /* 1.7 T block */);

(function /* 2.1 L params */ () /* 2.2 L block */ {});

(function /* 3.1 L id */ name /* 3.2 L tparams */ <T> /* 3.3 L params */ () {});

(function name() /* 4.1 T params */ : any {});

(function /* 5.1 L tparams */ <T> /* 5.2 L params */ () {});

(function () {} /* 6.1 T block */
/* 6.2 T block */);

(function /* 7.1 L id */ foo /* 7.2 L tparams */ <T> /* 7.3 L params */ () /* 7.4 T params */ : /* 7.5 L any */ any /* 7.6 L block */ {})

(function /* 8.1 L id */ foo /* 8.2 T id */
  /* 8.3 L tparams */ <T> /* 8.4 T tparams */
  /* 8.5 L params */ () /* 8.6 T params */
  /* 8.7 T params */ : /* 8.8 L any */ any /* 8.9 T any */
  /* 8.10 L pred */ %checks /* 8.11 T pred */
  /* 8.12 L block */ {})

(function /* 9.1 L id */ foo /* 9.2 T id */
  /* 9.3 L params */ () /* 9.4 T params */
  : /* 9.5 L any */ any /* 9.6 T any */
  /* 9.7 L block */ {})

(function /* 10.1 L id */ foo /* 10.2 T id */
  /* 10.3 L params */ () /* 10.4 T params */
  /* 10.5 L block */ {})
