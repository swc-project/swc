function foo(
  /* 1.1 L id */ a /* 1.2 T id */, /* 1.3 T id */
  /* 1.4 L id */ b /* 1.5 T id */, /* 1.6 T id */
){}

foo(
  /* 2.1 L id */ a, /* 2.2 T id */
  /* 2.3 L id */ b, /* 2.4 T id */
);

[
  /* 3.1 L id */ a, /* 3.2 T id */
  /* 3.3 L id */ b, /* 3.4 T id */
];

(
  /* 4.1 L id */ a, /* 4.2 T id */
  /* 4.3 L id */ b /* 4.4 T id */
);

const /* 5.1 L id */ a = 1, /* 5.2 T num */
  /* 5.3 L id */ b = 2 /* 5.4 T num */;

({
  /* 6.1 L id */ a: 1, /* 6.2 T num */
  /* 6.3 L id */ b: 2, /* 6.4 T num */
});

foo<
  /* 7.1 L id */ A, /* 7.2 T id */
  /* 7.3 L id */ B, /* 7.4 T id */
>();

type Foo = {
  /* 8.1 L id */ a: any, /* 8.2 T any */
  /* 8.3 L id */ b: any, /* 8.4 T any */
};

enum Foo {
  /* 9.1 L id */ A, /* 9.2 T id */
  /* 9.3 L id */ B, /* 9.4 T id */
}
