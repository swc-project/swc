class C {
  /* 1.1 L id */ method /* 1.2 L tparams */ <T> /* 1.3 L params */ () /* 1.4 L block */ {} /* 1.5 T block */

  /* 2.1 L meth */ static /* 2.2 L meth */ async /* 2.3 L meth */ * /* 2.4 L id */ method(){}

  /* 3.1 L meth */ get /* 3.2 L id */ getter /* 3.3 L params */ () /* 3.4 L block */ {} /* 3.5 T block */
  /* 4.1 L meth */ set /* 4.2 L id */ setter /* 4.3 L params */ (x) /* 4.4 L block */ {} /* 4.5 T block */

  /* 5.1 L meth */ static /* 5.2 L meth */ get /* 5.3 L id */ getter() {}
  /* 6.1 L meth */ static /* 6.2 L meth */ set /* 6.3 L id */ setter(x) {}
}

class C { method(){} /* 7.1 L id */ method(){} /* 7.2 T block */ }

class C {
  /* 8.1 L id */ method(){} /* 8.2 T block */
  /* 8.3 L id */ method(){} /* 8.4 T block */
  /* 8.5 T block */
}

class C {
  method /* 9.1 L tparams */ <T> /* 9.2 L params */ () /* 9.3 T params */ : /* 9.4 L any */ any /* 9.5 L block */ {}

  method /* 10.1 L tparams */ <T> /* 10.2 T tparams */
    /* 10.3 L params */ () /* 10.4 T params */
    : /* 10.5 L any */ any /* 10.6 T any */
    /* 10.7 L block */ {}

  method /* 11.1 L params */ () /* 11.2 T params */
    /* 11.3 L block */ {}

  get getter /* 12.1 L params */ () /* 12.2 T params */ : /* 12.3 L any */ any /* 12.4 L block */ {}

  get getter /* 13.1 T id */
    /* 13.2 L params */ () /* 13.3 T params */
    : /* 13.4 L any */ any /* 13.5 T any */
    /* 13.6 L block */ {}

  get getter /* 14.1 T id */
    /* 14.2 L params */ () /* 14.3 T params */
    /* 14.4 L block */ {}
}
