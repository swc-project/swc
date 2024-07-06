a as T;
a || b as T; // `a || (b as T)`
a && b as T; // `a && (b as T)`
a === b as T; // `a === (b as T)`
a < b as T; // `(a < b) as T`
a in b as T; // `(a in b) as T`
a + b as T; // `(a + b) as T`
a = b as T; // `a = (b as T)`
new a as T; // `(new as) as T)`
a as T && b; // `(a as T) && b`
a as T || b; // `(a as T) || b`
a as T === b; // `(a as T) === b`
a as const;
a as T as S; // `(a as T) as S`
a === b as T as S === c; // (a == ((b as T) as S)) === c
a + b as T as S + c; // (((a + b) as T) as S) + c;
