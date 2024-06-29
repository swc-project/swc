/* 1.1 L alias */ declare /* 1.2 L alias */ type T = any; /* 1.3 T alias */

/* 2.1 L opaque */ declare /* 2.2 L opaque */ opaque type T; /* 2.3 T opaque */

{
  /* 3.1 L alias */ declare type T = any /* 3.2 T any */
  /* 3.3 L alias */ declare type T = any
  /* 3.4 T any */
}

{
  /* 4.1 L alias */ declare opaque type T /* 4.2 T id */
  /* 4.3 L alias */ declare opaque type T
  /* 4.4 T id */
}

{
  /* 5.1 L alias */ declare opaque type T<U> /* 5.2 T tparams */
  /* 5.3 L alias */ declare opaque type T<U>
  /* 5.4 T tparams */
}

{
  /* 6.1 L alias */ declare opaque type T: Foo /* 6.2 T id */
  /* 6.3 L alias */ declare opaque type T: Foo
  /* 6.4 T id */
}
