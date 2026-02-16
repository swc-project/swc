// In TSX mode, `<T>` is ambiguous with JSX. Use `<T,>` to disambiguate.
<T,>(a: T): T => a;

// Default type parameter is unambiguous — not valid JSX.
<A = any>(v: A): A => v;

// Validate that we are indeed in jsx mode;
<h1>hi</h1>;
