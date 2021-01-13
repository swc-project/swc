use crate::option::CompressOptions;
use crate::util::Optional;
use drop_console::drop_console;
use hoist_props::property_hoister;
use std::borrow::Cow;
use swc_common::chain;
use swc_common::pass::CompilerPass;
use swc_common::pass::Repeat;
use swc_common::pass::Repeated;
use swc_ecma_ast::*;
use swc_ecma_transforms::optimization::simplify::expr_simplifier;
use swc_ecma_transforms::pass::JsPass;
use swc_ecma_utils::StmtLike;
use swc_ecma_visit::as_folder;
use swc_ecma_visit::noop_visit_mut_type;
use swc_ecma_visit::VisitMut;
use swc_ecma_visit::VisitMutWith;

mod drop_console;
mod hoist_props;

pub fn compressor(options: &CompressOptions) -> impl '_ + JsPass {
    let console_remover = Optional {
        enabled: options.drop_console,
        visitor: drop_console(),
    };
    let expr_pass = Optional {
        enabled: options.expr,
        visitor: expr_simplifier(),
    };
    let compressor = Compressor {
        options,
        pass: 0,
        changed: false,
    };

    let repeated_passes = Repeat::new(chain!(expr_pass, as_folder(compressor)));

    chain!(
        console_remover,
        repeated_passes,
        Optional {
            enabled: options.expr,
            visitor: expr_simplifier(),
        }
    )
}

#[derive(Debug)]
struct Compressor<'a> {
    options: &'a CompressOptions,
    changed: bool,
    pass: usize,
}

impl CompilerPass for Compressor<'_> {
    fn name() -> Cow<'static, str> {
        "compressor".into()
    }
}

impl Repeated for Compressor<'_> {
    fn changed(&self) -> bool {
        self.changed
    }

    fn reset(&mut self) {
        self.changed = false;
        self.pass += 1;
    }
}

impl Compressor<'_> {
    fn handle_stmt_likes<T>(&mut self, stmts: &mut Vec<T>)
    where
        T: StmtLike,
        Vec<T>: VisitMutWith<Self> + VisitMutWith<hoist_props::Hoister>,
    {
        // Skip if `use asm` exists.
        if stmts.iter().any(|stmt| match stmt.as_stmt() {
            Some(v) => match v {
                Stmt::Expr(stmt) => match &*stmt.expr {
                    Expr::Lit(Lit::Str(Str {
                        value,
                        has_escape: false,
                        ..
                    })) => &**value == "use asm",
                    _ => false,
                },
                _ => false,
            },
            None => false,
        }) {
            return;
        }

        stmts.visit_mut_with(&mut property_hoister());

        // TODO: Hoist decls

        // This is swc version of `node.optimize(this);`.
        stmts.visit_mut_children_with(self);

        // TODO: drop unused
    }
}

impl VisitMut for Compressor<'_> {
    noop_visit_mut_type!();

    fn visit_mut_module(&mut self, n: &mut Module) {
        if self.pass > 0 || self.options.reduce_vars {
            // reset_opt_flags
        }

        n.visit_mut_children_with(self);
    }

    fn visit_mut_stmt(&mut self, n: &mut Stmt) {
        // TODO: Skip if node is already optimized.
        // if (has_flag(node, SQUEEZED)) return node;

        n.visit_mut_children_with(self);
    }

    fn visit_mut_module_items(&mut self, stmts: &mut Vec<ModuleItem>) {
        self.handle_stmt_likes(stmts);

        stmts.retain(|stmt| match stmt {
            ModuleItem::Stmt(Stmt::Empty(..)) => false,
            ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                decl: Decl::Var(VarDecl { decls, .. }),
                ..
            }))
            | ModuleItem::Stmt(Stmt::Decl(Decl::Var(VarDecl { decls, .. })))
                if decls.is_empty() =>
            {
                false
            }
            _ => true,
        });
    }

    fn visit_mut_stmts(&mut self, stmts: &mut Vec<Stmt>) {
        self.handle_stmt_likes(stmts);

        stmts.retain(|stmt| match stmt {
            Stmt::Empty(..) => false,
            Stmt::Decl(Decl::Var(VarDecl { decls, .. })) if decls.is_empty() => false,
            _ => true,
        });
    }
}
