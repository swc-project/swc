use swc_common::Mark;
use swc_ecma_ast::Pass;
use swc_ecma_visit::{visit_mut_pass, InjectVars, VisitMut, VisitMutWith};

/// Compile ES2015 arrow functions to ES5
///
///# Example
///
///## In
/// ```js
/// var a = () => {};
/// var a = (b) => b;ß
///
/// const double = [1,2,3].map((num) => num * 2);
/// console.log(double); // [2,4,6]
///
/// var bob = {
///   _name: "Bob",
///   _friends: ["Sally", "Tom"],
///   printFriends() {
///     this._friends.forEach(f =>
///       console.log(this._name + " knows " + f));
///   }
/// };
/// console.log(bob.printFriends());
/// ```
///
///## Out
///```js
/// var a = function () {};
/// var a = function (b) {
///   return b;
/// };
///
/// const double = [1, 2, 3].map(function (num) {
///   return num * 2;
/// });
/// console.log(double); // [2,4,6]
///
/// var bob = {
///   _name: "Bob",
///   _friends: ["Sally", "Tom"],
///   printFriends() {
///     var _this = this;
///
///     this._friends.forEach(function (f) {
///       return console.log(_this._name + " knows " + f);
///     });
///   }
/// };
/// console.log(bob.printFriends());
/// ```
///
/// # Note
///
/// This is a backward compatibility wrapper around the new hook-based
/// implementation in `swc_ecma_transformer`.
pub fn arrow(unresolved_mark: Mark) -> impl Pass + VisitMut + InjectVars {
    visit_mut_pass(ArrowCompat { unresolved_mark })
}

struct ArrowCompat {
    unresolved_mark: Mark,
}

impl VisitMut for ArrowCompat {
    fn visit_mut_program(&mut self, program: &mut swc_ecma_ast::Program) {
        use swc_ecma_hooks::VisitMutHook;
        use swc_ecma_transformer::{
            es2015::{self, Es2015Options},
            TraverseCtx,
        };

        let mut options = Es2015Options::default();
        options.arrow_functions = Some(self.unresolved_mark);

        let mut hook = es2015::hook(options);
        let mut ctx = TraverseCtx {
            statement_injector: Default::default(),
        };

        hook.enter_program(program, &mut ctx);
        program.visit_mut_children_with(&mut HookVisitor {
            hook: &mut hook,
            ctx: &mut ctx,
        });
        hook.exit_program(program, &mut ctx);
    }
}

/// Helper visitor that delegates to the hook
struct HookVisitor<'a, H>
where
    H: swc_ecma_hooks::VisitMutHook<swc_ecma_transformer::TraverseCtx>,
{
    hook: &'a mut H,
    ctx: &'a mut swc_ecma_transformer::TraverseCtx,
}

impl<H> VisitMut for HookVisitor<'_, H>
where
    H: swc_ecma_hooks::VisitMutHook<swc_ecma_transformer::TraverseCtx>,
{
    fn visit_mut_expr(&mut self, expr: &mut swc_ecma_ast::Expr) {
        self.hook.enter_expr(expr, self.ctx);
        expr.visit_mut_children_with(self);
        self.hook.exit_expr(expr, self.ctx);
    }

    fn visit_mut_stmt(&mut self, stmt: &mut swc_ecma_ast::Stmt) {
        self.hook.enter_stmt(stmt, self.ctx);
        stmt.visit_mut_children_with(self);
        self.hook.exit_stmt(stmt, self.ctx);
    }

    fn visit_mut_class(&mut self, class: &mut swc_ecma_ast::Class) {
        self.hook.enter_class(class, self.ctx);
        class.visit_mut_children_with(self);
        self.hook.exit_class(class, self.ctx);
    }

    fn visit_mut_function(&mut self, func: &mut swc_ecma_ast::Function) {
        self.hook.enter_function(func, self.ctx);
        func.visit_mut_children_with(self);
        self.hook.exit_function(func, self.ctx);
    }
}

impl InjectVars for ArrowCompat {
    fn take_vars(&mut self) -> Vec<swc_ecma_ast::VarDeclarator> {
        // The new implementation injects variables differently
        Vec::new()
    }
}
