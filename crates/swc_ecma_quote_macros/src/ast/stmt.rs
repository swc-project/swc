use pmutil::q;
use swc_ecma_ast::*;

use super::ToCode;
use crate::ctxt::Ctx;

impl_struct!(EmptyStmt, [span]);
impl_struct!(BlockStmt, [span, stmts]);
impl_struct!(DebuggerStmt, [span]);
impl_struct!(WithStmt, [span, obj, body]);
impl_struct!(LabeledStmt, [span, label, body]);
impl_struct!(BreakStmt, [span, label]);
impl_struct!(ContinueStmt, [span, label]);
impl_struct!(IfStmt, [span, test, cons, alt]);
impl_struct!(SwitchStmt, [span, discriminant, cases]);
impl_struct!(ThrowStmt, [span, arg]);
impl_struct!(TryStmt, [span, block, handler, finalizer]);
impl_struct!(WhileStmt, [span, test, body]);
impl_struct!(DoWhileStmt, [span, test, body]);
impl_struct!(ForStmt, [span, init, test, update, body]);
impl_struct!(ForInStmt, [span, left, right, body]);
impl_struct!(ForOfStmt, [span, await_token, left, right, body]);
impl_struct!(ReturnStmt, [span, arg]);
impl_struct!(ExprStmt, [span, expr]);
