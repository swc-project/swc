use std::borrow::Cow;
use std::mem::take;
use swc_common::pass::CompilerPass;
use swc_ecma_ast::*;
use swc_ecma_transforms::pass::JsPass;
use swc_ecma_visit::as_folder;
use swc_ecma_visit::noop_visit_mut_type;
use swc_ecma_visit::VisitMut;
use swc_ecma_visit::VisitMutWith;

pub fn drop_console() -> impl JsPass {
    as_folder(DropConsole { done: false })
}

struct DropConsole {
    /// Invoking this pass multiple times is simply waste of time.
    done: bool,
}

impl CompilerPass for DropConsole {
    fn name() -> Cow<'static, str> {
        "drop-console".into()
    }
}

impl VisitMut for DropConsole {
    noop_visit_mut_type!();

    fn visit_mut_expr(&mut self, n: &mut Expr) {
        if self.done {
            return;
        }

        n.visit_mut_children_with(self);

        match n {
            Expr::Call(CallExpr {
                span, callee, args, ..
            }) => {
                // Find console.log
                let callee = match callee {
                    ExprOrSuper::Expr(callee) => callee,
                    _ => return,
                };

                match &**callee {
                    Expr::Member(MemberExpr {
                        obj: ExprOrSuper::Expr(callee_obj),
                        prop: callee_prop,
                        computed: false,
                        ..
                    }) => {
                        match (&**callee_obj, &**callee_prop) {
                            (Expr::Ident(obj), Expr::Ident(prop)) => {
                                if obj.sym != *"console" {
                                    return;
                                }

                                match &*prop.sym {
                                    "log" | "info" => {}
                                    _ => return,
                                }
                            }
                            _ => return,
                        }

                        // Sioplifier will remove side-effect-free items.
                        *n = Expr::Seq(SeqExpr {
                            span: *span,
                            exprs: take(args).into_iter().map(|arg| arg.expr).collect(),
                        })
                    }
                    _ => {}
                }
            }
            _ => {}
        }
    }

    fn visit_mut_module(&mut self, n: &mut Module) {
        if self.done {
            return;
        }

        n.visit_mut_children_with(self);

        self.done = true;
    }
}
