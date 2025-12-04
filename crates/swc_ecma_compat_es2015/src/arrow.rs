use swc_common::Mark;
use swc_ecma_ast::Pass;
use swc_ecma_visit::{visit_mut_pass, InjectVars, VisitMut};

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
        use swc_ecma_hooks::VisitMutWithHook;
        use swc_ecma_transformer::{
            es2015::{self, Es2015Options},
            TraverseCtx,
        };
        use swc_ecma_visit::VisitMutWith;

        let mut options = Es2015Options::default();
        options.arrow_functions = Some(self.unresolved_mark);

        let hook = es2015::hook(options);
        let ctx = TraverseCtx {
            statement_injector: Default::default(),
        };

        let mut visitor = VisitMutWithHook { hook, context: ctx };
        program.visit_mut_with(&mut visitor);
    }

    fn visit_mut_expr(&mut self, expr: &mut swc_ecma_ast::Expr) {
        use swc_ecma_hooks::VisitMutWithHook;
        use swc_ecma_transformer::{
            es2015::{self, Es2015Options},
            TraverseCtx,
        };
        use swc_ecma_visit::VisitMutWith;

        let mut options = Es2015Options::default();
        options.arrow_functions = Some(self.unresolved_mark);

        let hook = es2015::hook(options);
        let ctx = TraverseCtx {
            statement_injector: Default::default(),
        };

        let mut visitor = VisitMutWithHook { hook, context: ctx };
        expr.visit_mut_with(&mut visitor);
    }
}

impl InjectVars for ArrowCompat {
    fn take_vars(&mut self) -> Vec<swc_ecma_ast::VarDeclarator> {
        // The new implementation injects variables differently
        Vec::new()
    }
}
