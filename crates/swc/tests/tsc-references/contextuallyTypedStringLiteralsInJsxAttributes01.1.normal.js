//// [contextuallyTypedStringLiteralsInJsxAttributes01.tsx]
//! 
//!   x Expected a semicolon
//!     ,----
//!  11 | const FooComponent = (props: { foo: "A" | "B" | "C" }) => <span>{props.foo}</span>;
//!     :                                                                       ^
//!     `----
//! 
//!   x Expected ',', got '.'
//!     ,----
//!  11 | const FooComponent = (props: { foo: "A" | "B" | "C" }) => <span>{props.foo}</span>;
//!     :                                                                       ^
//!     `----
