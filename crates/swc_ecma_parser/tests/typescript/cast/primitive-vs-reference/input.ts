// Primitive keyword types - < should be comparison operator
i as number < 5;
i as string < "hello";
i as boolean < true;
i as any < foo;
i as void < bar;
i as undefined < baz;
i as null < qux;
i as never < abc;
i as unknown < def;
i as object < ghi;
i as symbol < jkl;
i as bigint < 10n;

// satisfies with primitive types
i satisfies number < 5;
i satisfies string < "test";

// Literal types - should be treated as primitives
i as 2 < 5;
i as "x" < "y";
i as true < false;
i as 10n < 20n;

// this type - non-callable
i as this < 5;

// Array types
i as X[] < 5;

// Generic types
i as X<Y> < 5;

// Tuple types - non-callable
i as [X, Y] < 5;

// Union types - non-callable
i as A | string < 5;
i as A | B<T> < 5;

// Intersection types - non-callable
i as A & string < 5;
i as A & B<T> < 5;

// Type operators - non-callable
i as keyof T<U> < 5;
i as readonly number[] < 5;
i as unique symbol < 5;

// Indexed access types - non-callable
i as T[K] < 5;

// Conditional types - non-callable
i as T extends U ? X : string < 5;
i as T extends U ? X : Y<T> < 5;

// Mapped types - non-callable
i as { [K in keyof T]: V } < 5;
