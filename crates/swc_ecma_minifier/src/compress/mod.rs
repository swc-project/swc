use std::{
    borrow::Cow,
    fmt,
    fmt::{Debug, Display, Formatter, Write},
    thread,
    time::Instant,
};

#[cfg(feature = "pretty_assertions")]
use pretty_assertions::assert_eq;
use rayon::prelude::*;
use swc_common::{
    chain,
    pass::{CompilerPass, Repeated},
    Globals,
};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::pass::JsPass;
use swc_ecma_transforms_optimization::simplify::{
    dead_branch_remover, expr_simplifier, ExprSimplifierConfig,
};
use swc_ecma_utils::StmtLike;
use swc_ecma_visit::{as_folder, noop_visit_mut_type, VisitMut, VisitMutWith, VisitWith};
use swc_timer::timer;
use tracing::{debug, error};

pub(crate) use self::pure::{pure_optimizer, PureOptimizerConfig};
use self::{hoist_decls::DeclHoisterConfig, optimize::optimizer};
use crate::{
    analyzer::{analyze, UsageAnalyzer},
    compress::hoist_decls::decl_hoister,
    debug::{dump, AssertValid},
    marks::Marks,
    mode::Mode,
    option::CompressOptions,
    tracker::Tracker,
    util::{now, unit::CompileUnit, Optional},
    DISABLE_BUGGY_PASSES, MAX_PAR_DEPTH,
};

mod hoist_decls;
mod optimize;
mod pure;
mod util;

pub(crate) fn compressor<'a, M>(
    globals: &'a Globals,
    marks: Marks,
    options: &'a CompressOptions,
    mode: &'a M,
    tracker: Tracker,
) -> impl 'a + JsPass
where
    M: Mode,
{
    let compressor = Compressor {
        globals,
        marks,
        options,
        changed: false,
        pass: 1,
        left_parallel_depth: 0,
        mode,
        dump_for_infinite_loop: Default::default(),
        tracker,
    };

    chain!(
        as_folder(compressor),
        Optional {
            enabled: options.evaluate || options.side_effects,
            visitor: expr_simplifier(marks.unresolved_mark, ExprSimplifierConfig {})
        }
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
    /// `0` means we should not create more threads.
    left_parallel_depth: u8,

    dump_for_infinite_loop: Vec<String>,

    mode: &'a M,

    tracker: Tracker,
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
            Some(Stmt::Expr(stmt)) => match &*stmt.expr {
                // TODO improve check, directives can contain escaped characters
                Expr::Lit(Lit::Str(Str { value, .. })) => &**value == "use asm",
                _ => false,
            },
            _ => false,
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
        trace_op!("visit_par(left_depth = {})", self.left_parallel_depth);

        if self.left_parallel_depth == 0 || cfg!(target_arch = "wasm32") {
            for node in nodes {
                let mut v = Compressor {
                    globals: self.globals,
                    marks: self.marks,
                    options: self.options,
                    changed: false,
                    pass: self.pass,
                    left_parallel_depth: 0,
                    mode: self.mode,
                    dump_for_infinite_loop: Default::default(),
                    tracker: self.tracker.clone(),
                };
                node.visit_mut_with(&mut v);

                self.changed |= v.changed;
            }
        } else {
            let results = nodes
                .par_iter_mut()
                .map(|node| {
                    swc_common::GLOBALS.set(self.globals, || {
                        let mut v = Compressor {
                            globals: self.globals,
                            marks: self.marks,
                            options: self.options,
                            changed: false,
                            pass: self.pass,
                            left_parallel_depth: self.left_parallel_depth - 1,
                            mode: self.mode,
                            dump_for_infinite_loop: Default::default(),
                            tracker: self.tracker.clone(),
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
        N: CompileUnit
            + VisitWith<UsageAnalyzer>
            + for<'aa> VisitMutWith<Compressor<'aa, M>>
            + VisitWith<AssertValid>,
    {
        trace_op!(
            "Optimizing a compile unit within `{:?}`",
            thread::current().name()
        );

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
        N: CompileUnit
            + VisitWith<UsageAnalyzer>
            + for<'aa> VisitMutWith<Compressor<'aa, M>>
            + VisitWith<AssertValid>,
    {
        let _timer = timer!("optimize", pass = self.pass);

        if self.options.passes != 0 && self.options.passes < self.pass {
            let done = dump(&*n, false);
            debug!("===== Done =====\n{}", done);
            return;
        }

        // This exists to prevent hanging.
        if self.pass > 200 {
            if self.dump_for_infinite_loop.is_empty() {
                error!("Seems like there's an infinite loop");
            }

            let code = n.force_dump();

            if self.dump_for_infinite_loop.contains(&code) {
                let mut msg = String::new();

                for (i, code) in self.dump_for_infinite_loop.iter().enumerate() {
                    let _ = write!(msg, "Code {:>4}:\n\n\n\n\n\n\n\n\n\n{}\n", i, code);

                    // std::fs::write(&format!("pass_{}.js", i), code).unwrap();
                }

                panic!(
                    "Infinite loop detected (current pass = {})\n{}",
                    self.pass, msg
                )
            } else {
                self.dump_for_infinite_loop.push(code);
            }
        }

        let start = if cfg!(feature = "debug") {
            let start = n.dump();
            debug!("===== Start =====\n{}", start);
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

            let mut visitor = expr_simplifier(self.marks.unresolved_mark, ExprSimplifierConfig {});
            n.apply(&mut visitor);

            self.changed |= visitor.changed();
            if visitor.changed() {
                debug!("compressor: Simplified expressions");
                if cfg!(feature = "debug") {
                    debug!("===== Simplified =====\n{}", dump(&*n, false));
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
            let _timer = timer!("apply pure optimizer");

            let mut visitor = pure_optimizer(
                self.options,
                None,
                self.marks,
                PureOptimizerConfig {
                    enable_join_vars: self.pass > 1,
                    force_str_for_tpl: M::force_str_for_tpl(),
                    debug_infinite_loop: self.pass >= 20,
                },
                self.tracker.clone(),
            );
            n.apply(&mut visitor);

            self.changed |= visitor.changed();

            if cfg!(feature = "debug") && visitor.changed() {
                let src = n.dump();
                debug!("===== After pure =====\n{}\n{}", start, src);
            }
        }

        if cfg!(debug_assertions) {
            n.visit_with(&mut AssertValid);
        }

        {
            let _timer = timer!("apply full optimizer");

            let mut data = analyze(&*n, Some(self.marks));

            // TODO: reset_opt_flags
            //
            // This is swc version of `node.optimize(this);`.

            let mut visitor = optimizer(
                self.marks,
                self.options,
                &mut data,
                self.mode,
                !self.dump_for_infinite_loop.is_empty(),
            );
            n.apply(&mut visitor);

            self.changed |= visitor.changed();

            // let done = dump(&*n);
            // debug!("===== Result =====\n{}", done);
        }

        if self.options.conditionals || self.options.dead_code {
            let start = if cfg!(feature = "debug") {
                dump(&*n, false)
            } else {
                "".into()
            };

            let start_time = now();

            let mut v = dead_branch_remover(self.marks.unresolved_mark);
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
                let simplified = dump(&*n, false);

                if start != simplified {
                    debug!(
                        "===== Removed dead branches =====\n{}\n==== ===== ===== ===== ======\n{}",
                        start, simplified
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
        if !DISABLE_BUGGY_PASSES && n.function.span.has_mark(self.marks.standalone) {
            self.optimize_unit_repeatedly(n);
            return;
        }

        n.visit_mut_children_with(self);
    }

    fn visit_mut_module(&mut self, n: &mut Module) {
        let is_bundle_mode =
            !DISABLE_BUGGY_PASSES && n.span.has_mark(self.marks.bundle_of_standalone);

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
