(/* 1.1 L obj */ {a: 1} /* 1.2 T obj */);

({ /* 2.1 L id */ a /* 2.2 T id */ : /* 2.3 L num */ 1 /* 2.4 T num */ });

({ /* 3.1 L computed */ [/* 3.2 L str */ 'a' /* 3.3 T str */] /* 3.4 T computed */ : 1 });

({ /* 4.1 L spread */ ... /* 4.2 L obj */ {} /* 4.3 T obj */ });

({ /* 5.1 L func */ async /* 5.2 L func */ * /* 5.3 L id */ method /* 5.4 L tparams */ <T> /* 5.5 L params */ () /* 5.6 L block */ {} /* 5.7 L block */ });

({ /* 6.1 L getter */ get /* 6.2 L id */ getter(){} });

({ /* 7.1 L setter */ set /* 7.2 L id */ setter(x){} });

({
  method /* 8.1 L tparams */ <T> /* 8.2 L params */ () /* 8.3 T params */ : /* 8.4 L any */ any /* 8.5 L block */ {},

  method /* 9.1 L tparams */ <T> /* 9.2 T tparams */
    /* 9.3 L params */ () /* 9.4 T params */
    : /* 9.5 L any */ any /* 9.6 T any */
    /* 9.7 L block */ {},

  method /* 10.1 L params */ () /* 10.2 T params */
    /* 10.3 L block */ {},

  get getter /* 11.1 L params */ () /* 11.2 T params */ : /* 11.3 L any */ any /* 11.4 L block */ {},

  get getter /* 12.1 T id */
    /* 12.2 L params */ () /* 12.3 T params */
    : /* 12.4 L any */ any /* 12.5 T any */
    /* 12.6 L block */ {},

  get getter /* 13.1 T id */
    /* 13.2 L params */ () /* 13.3 T params */
    /* 13.4 L block */ {}
});

({ /* 14.1 I obj */ });

({ a, /* 15.1 I obj */ });

({ /* 16.1 L id */ get(){} });

({ /* 17.1 L id */ set(){} });
