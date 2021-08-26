use serde::Deserialize;
use swc_common::DUMMY_SP;
use swc_plugin::{
    define_js_processor,
    ecmascript::{
        ast::*,
        utils::ExprExt,
        visit::{as_folder, noop_visit_mut_type, Fold, VisitMut, VisitMutWith},
    },
};

define_js_processor!(drop_console);

fn drop_console(_: Config) -> impl Fold {
    as_folder(DropConsole)
}

struct DropConsole;

impl VisitMut for DropConsole {
    noop_visit_mut_type!();

    fn visit_mut_stmt(&mut self, s: &mut Stmt) {
        s.visit_mut_children_with(self);

        match s {
            Stmt::Expr(ExprStmt { span, expr }) => match &**expr {
                Expr::Call(CallExpr {
                    callee: ExprOrSuper::Expr(callee),
                    ..
                }) => match &**callee {
                    Expr::Member(MemberExpr {
                        obj: ExprOrSuper::Expr(obj),
                        prop,
                        computed: false,
                        ..
                    }) => {
                        if obj.is_ident_ref_to("console".into())
                            && prop.is_ident_ref_to("log".into())
                        {
                            *s = Stmt::Empty(EmptyStmt { span: DUMMY_SP });
                        }
                    }

                    _ => {}
                },

                _ => {}
            },

            _ => {}
        }
    }
}

#[derive(Deserialize)]
struct Config;
