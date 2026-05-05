use swc_ecma_ast::*;

impl_enum!(
    Stmt,
    [
        Block, Empty, Debugger, With, Return, Labeled, Break, Continue, If, Switch, Throw, Try,
        While, DoWhile, For, ForIn, ForOf, Decl, Expr
    ]
);

impl_struct!(EmptyStmt, [span]);
impl_struct!(BlockStmt, [node_id, span, ctxt, stmts]);
impl_struct!(DebuggerStmt, [span]);
impl_struct!(WithStmt, [span, obj, body]);
impl_struct!(LabeledStmt, [span, label, body]);
impl_struct!(BreakStmt, [span, label]);
impl_struct!(ContinueStmt, [span, label]);
impl_struct!(IfStmt, [span, test, cons, alt]);
impl_struct!(SwitchStmt, [node_id, span, discriminant, cases]);
impl_struct!(ThrowStmt, [span, arg]);
impl_struct!(TryStmt, [span, block, handler, finalizer]);
impl_struct!(WhileStmt, [span, test, body]);
impl_struct!(DoWhileStmt, [span, test, body]);
impl_struct!(ForStmt, [node_id, span, init, test, update, body]);
impl_struct!(ForInStmt, [node_id, span, left, right, body]);
impl_struct!(ForOfStmt, [node_id, span, is_await, left, right, body]);
impl_struct!(ReturnStmt, [span, arg]);
impl_struct!(ExprStmt, [span, expr]);

impl_enum!(VarDeclOrExpr, [VarDecl, Expr]);
impl_enum!(ForHead, [VarDecl, UsingDecl, Pat]);

impl_struct!(SwitchCase, [span, test, cons]);

impl_struct!(CatchClause, [node_id, span, param, body]);
