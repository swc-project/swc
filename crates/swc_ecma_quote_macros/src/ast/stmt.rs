use swc_ecma_ast::*;

impl_enum!(
    Stmt,
    [
        Block, Empty, Debugger, With, Return, Labeled, Break, Continue, If, Switch, Throw, Try,
        While, DoWhile, For, ForIn, ForOf, Decl, Expr
    ]
);

impl_struct!(EmptyStmt, [span]);
impl_struct!(BlockStmt, [span, ctxt, stmts]);
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
impl_struct!(ForOfStmt, [span, is_await, left, right, body]);
impl_struct!(ReturnStmt, [span, arg]);
impl_struct!(ExprStmt, [span, expr]);

impl_enum!(VarDeclOrExpr, [VarDecl, Expr]);
impl_enum!(ForHead, [VarDecl, UsingDecl, Pat]);

impl_struct!(SwitchCase, [span, test, cons]);

impl_struct!(CatchClause, [span, param, body]);
