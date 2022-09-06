//// [tsxSpreadChildrenInvalidType.tsx]
//! 
//!   x Spread children are not supported in React.
//!     ,----
//!  21 | {...<Todo key={todos[0].id} todo={todos[0].todo} />}
//!     : ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//!     `----
//! 
//!   x Spread children are not supported in React.
//!     ,----
//!  27 | {...(<Todo key={todos[0].id} todo={todos[0].todo} /> as any)}
//!     : ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//!     `----
