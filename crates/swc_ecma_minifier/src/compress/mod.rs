pub(crate) use self::pure::pure_optimizer;
use self::{
    drop_console::drop_console,
    hoist_decls::DeclHoisterConfig,
    optimize::{optimizer, OptimizerState},
};
use crate::{
    analyzer::{analyze, ProgramData, UsageAnalyzer},
    compress::hoist_decls::decl_hoister,
    debug::dump,
    marks::Marks,
    mode::Mode,
    option::CompressOptions,
    util::{now, unit::CompileUnit, Optional},
    MAX_PAR_DEPTH,
};
#[cfg(feature = "pretty_assertions")]
use pretty_assertions::assert_eq;
use rayon::prelude::*;
use std::{
    borrow::Cow,
    fmt,
    fmt::{Debug, Display, Formatter},
    thread,
    time::Instant,
};
use swc_common::{
    chain,
    pass::{CompilerPass, Repeated},
    Globals,
};
use swc_ecma_ast::*;
use swc_ecma_transforms::{
    optimization::simplify::{dead_branch_remover, expr_simplifier, ExprSimplifierConfig},
    pass::JsPass,
};
use swc_ecma_utils::StmtLike;
use swc_ecma_visit::{as_folder, noop_visit_mut_type, VisitMut, VisitMutWith, VisitWith};
use tracing::{span, Level};

mod drop_console;
mod hoist_decls;
mod optimize;
mod pure;
mod util;

pub(crate) fn compressor<'a, M>(
    globals: &'a Globals,
    marks: Marks,
    options: &'a CompressOptions,
    mode: &'a M,
) -> impl 'a + JsPass
where
    M: Mode,
{
    let console_remover = Optional {
        enabled: options.drop_console,
        visitor: drop_console(),
    };
    let compressor = Compressor {
        globals,
        marks,
        options,
        changed: false,
        pass: 0,
        data: None,
        optimizer_state: Default::default(),
        left_parallel_depth: 0,
        mode,
    };

    chain!(
        console_remover,
        as_folder(compressor),
        expr_simplifier(ExprSimplifierConfig {
            preserve_string_call: true,
            ..Default::default()
        })
    )
}

struct Compressor<'a, M>
where
    M: Mode,
{
    globals: &'a Globals,
    marks: Marks,
    options: &'a CompressOptions,
    changed: bool,
    pass: usize,
    data: Option<ProgramData>,
    optimizer_state: OptimizerState,
    /// `0` means we should not create more threads.
    left_parallel_depth: u8,

    mode: &'a M,
}

impl<M> CompilerPass for Compressor<'_, M>
where
    M: Mode,
{
    fn name() -> Cow<'static, str> {
        "compressor".into()
    }
}

impl<M> Compressor<'_, M>
where
    M: Mode,
{
    fn handle_stmt_likes<T>(&mut self, stmts: &mut Vec<T>)
    where
        T: StmtLike,
        Vec<T>: VisitMutWith<Self> + for<'aa> VisitMutWith<hoist_decls::Hoister<'aa>>,
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

        stmts.visit_mut_children_with(self);

        // TODO: drop unused
    }

    /// Optimize a bundle in a parallel.
    fn visit_par<N>(&mut self, nodes: &mut Vec<N>)
    where
        N: Send + Sync + for<'aa> VisitMutWith<Compressor<'aa, M>>,
    {
        tracing::debug!("visit_par(left_depth = {})", self.left_parallel_depth);

        if self.left_parallel_depth == 0 || cfg!(target_arch = "wasm32") {
            for node in nodes {
                let mut v = Compressor {
                    globals: self.globals,
                    marks: self.marks,
                    options: self.options,
                    changed: false,
                    pass: self.pass,
                    data: None,
                    optimizer_state: Default::default(),
                    left_parallel_depth: 0,
                    mode: self.mode,
                };
                node.visit_mut_with(&mut v);

                self.changed |= v.changed;
            }
        } else {
            let results = nodes
                .par_iter_mut()
                .map(|node| {
                    swc_common::GLOBALS.set(&self.globals, || {
                        let mut v = Compressor {
                            globals: self.globals,
                            marks: self.marks,
                            options: self.options,
                            changed: false,
                            pass: self.pass,
                            data: None,
                            optimizer_state: Default::default(),
                            left_parallel_depth: self.left_parallel_depth - 1,
                            mode: self.mode,
                        };
                        node.visit_mut_with(&mut v);

                        v.changed
                    })
                })
                .collect::<Vec<_>>();

            for changed in results {
                self.changed |= changed;
            }
        }
    }

    fn optimize_unit_repeatedly<N>(&mut self, n: &mut N)
    where
        N: CompileUnit + VisitWith<UsageAnalyzer> + for<'aa> VisitMutWith<Compressor<'aa, M>>,
    {
        if cfg!(feature = "debug") {
            tracing::debug!(
                "Optimizing a compile unit within `{:?}`",
                thread::current().name()
            );
        }

        {
            let data = analyze(&*n, Some(self.marks));

            let mut v = decl_hoister(
                DeclHoisterConfig {
                    hoist_fns: self.options.hoist_fns,
                    hoist_vars: self.options.hoist_vars,
                    _top_level: self.options.top_level(),
                },
                &data,
            );
            n.apply(&mut v);
            self.changed |= v.changed();
        }

        loop {
            n.invoke();

            self.changed = false;
            self.optimize_unit(n);
            self.pass += 1;
            if !self.changed {
                break;
            }
        }

        self.pass = 0;
        // let last_mark = n.remove_mark();
        // assert!(
        //     N::is_module() || last_mark == self.marks.standalone,
        //     "{:?}; last={:?}",
        //     self.marks,
        //     last_mark
        // );
    }

    /// Optimize a module. `N` can be [Module] or [FnExpr].
    fn optimize_unit<N>(&mut self, n: &mut N)
    where
        N: CompileUnit + VisitWith<UsageAnalyzer> + for<'aa> VisitMutWith<Compressor<'aa, M>>,
    {
        self.data = Some(analyze(&*n, Some(self.marks)));

        let _tracing = if cfg!(feature = "debug") {
            Some(span!(Level::ERROR, "compressor", "pass" = self.pass).entered())
        } else {
            None
        };

        if self.options.passes != 0 && self.options.passes + 1 <= self.pass {
            let done = dump(&*n);
            tracing::debug!("===== Done =====\n{}", done);
            return;
        }

        // This exists to prevent hanging.
        if self.pass > 100 {
            panic!("Infinite loop detected (current pass = {})", self.pass)
        }

        let start = if cfg!(feature = "debug") {
            let start = n.dump();
            tracing::debug!("===== Start =====\n{}", start);
            start
        } else {
            String::new()
        };

        {
            tracing::info!(
                "compress: Running expression simplifier (pass = {})",
                self.pass
            );

            let start_time = now();

            let mut visitor = expr_simplifier(ExprSimplifierConfig {
                preserve_string_call: true,
            });
            n.apply(&mut visitor);
            self.changed |= visitor.changed();
            if visitor.changed() {
                n.invoke();

                tracing::debug!("compressor: Simplified expressions");
                if cfg!(feature = "debug") {
                    tracing::debug!("===== Simplified =====\n{}", dump(&*n));
                }
            }

            if let Some(start_time) = start_time {
                let end_time = Instant::now();

                tracing::info!(
                    "compress: expr_simplifier took {:?} (pass = {})",
                    end_time - start_time,
                    self.pass
                );
            }

            if cfg!(feature = "debug") && !visitor.changed() {
                let simplified = n.dump();
                if start != simplified {
                    assert_eq!(
                        DebugUsingDisplay(&start),
                        DebugUsingDisplay(&simplified),
                        "Invalid state: expr_simplifier: The code is changed but changed is not \
                         setted to true",
                    )
                }
            }
        }

        {
            tracing::info!(
                "compress/pure: Running pure optimizer (pass = {})",
                self.pass
            );

            let start_time = now();

            let mut visitor = pure_optimizer(&self.options, self.marks, self.mode, self.pass >= 20);
            n.apply(&mut visitor);
            self.changed |= visitor.changed();

            if let Some(start_time) = start_time {
                let end_time = Instant::now();

                tracing::info!(
                    "compress/pure: Pure optimizer took {:?} (pass = {})",
                    end_time - start_time,
                    self.pass
                );

                if cfg!(feature = "debug") && visitor.changed() {
                    n.invoke();

                    let start = n.dump();
                    tracing::debug!("===== After pure =====\n{}", start);
                }
            }
        }

        {
            tracing::info!("compress: Running optimizer (pass = {})", self.pass);

            let start_time = now();
            // TODO: reset_opt_flags
            //
            // This is swc version of `node.optimize(this);`.

            self.optimizer_state = Default::default();

            let mut visitor = optimizer(
                self.marks,
                self.options,
                self.data.as_ref().unwrap(),
                &mut self.optimizer_state,
                self.mode,
                self.pass >= 20,
            );
            n.apply(&mut visitor);
            self.changed |= visitor.changed();

            if let Some(start_time) = start_time {
                let end_time = Instant::now();

                tracing::info!(
                    "compress: Optimizer took {:?} (pass = {})",
                    end_time - start_time,
                    self.pass
                );
            }
            // let done = dump(&*n);
            // tracing::debug!("===== Result =====\n{}", done);
        }

        if self.options.conditionals || self.options.dead_code {
            let start = if cfg!(feature = "debug") {
                dump(&*n)
            } else {
                "".into()
            };

            let start_time = now();

            let mut v = dead_branch_remover();
            n.apply(&mut v);

            if let Some(start_time) = start_time {
                let end_time = Instant::now();

                tracing::info!(
                    "compress: dead_branch_remover took {:?} (pass = {})",
                    end_time - start_time,
                    self.pass
                );
            }

            if cfg!(feature = "debug") {
                let simplified = dump(&*n);

                if start != simplified {
                    tracing::debug!(
                        "===== Removed dead branches =====\n{}\n==== ===== ===== ===== ======\n{}",
                        start,
                        simplified
                    );
                }
            }

            self.changed |= v.changed();
        }
    }
}

impl<M> VisitMut for Compressor<'_, M>
where
    M: Mode,
{
    noop_visit_mut_type!();

    fn visit_mut_fn_expr(&mut self, n: &mut FnExpr) {
        if false && n.function.span.has_mark(self.marks.standalone) {
            self.optimize_unit_repeatedly(n);
            return;
        }

        n.visit_mut_children_with(self);
    }

    fn visit_mut_module(&mut self, n: &mut Module) {
        let is_bundle_mode = false && n.span.has_mark(self.marks.bundle_of_standalone);

        // Disable
        if is_bundle_mode {
            self.left_parallel_depth = MAX_PAR_DEPTH - 1;
        } else {
            self.optimize_unit_repeatedly(n);
            return;
        }

        n.visit_mut_children_with(self);

        self.optimize_unit_repeatedly(n);
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

    fn visit_mut_prop_or_spreads(&mut self, nodes: &mut Vec<PropOrSpread>) {
        self.visit_par(nodes);
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

#[derive(PartialEq, Eq)]
struct DebugUsingDisplay<'a>(pub &'a str);

impl<'a> Debug for DebugUsingDisplay<'a> {
    fn fmt(&self, f: &mut Formatter<'_>) -> fmt::Result {
        Display::fmt(self.0, f)
    }
}
