use self::drop_console::drop_console;
use self::hoist_decls::DeclHoisterConfig;
use self::optimize::optimizer;
use self::optimize::OptimizerState;
use crate::analyzer::analyze;
use crate::analyzer::ProgramData;
use crate::analyzer::UsageAnalyzer;
use crate::compress::hoist_decls::decl_hoister;
use crate::debug::dump;
use crate::debug::invoke;
use crate::marks::Marks;
use crate::option::CompressOptions;
use crate::util::now;
use crate::util::unit::CompileUnit;
use crate::util::Optional;
use crate::MAX_PAR_DEPTH;
#[cfg(feature = "pretty_assertions")]
use pretty_assertions::assert_eq;
use rayon::prelude::*;
use std::borrow::Cow;
use std::fmt;
use std::fmt::Debug;
use std::fmt::Display;
use std::fmt::Formatter;
use std::thread;
use std::time::Instant;
use swc_common::chain;
use swc_common::pass::CompilerPass;
use swc_common::pass::Repeated;
use swc_common::Globals;
use swc_ecma_ast::*;
use swc_ecma_transforms::optimization::simplify::dead_branch_remover;
use swc_ecma_transforms::optimization::simplify::expr_simplifier;
use swc_ecma_transforms::pass::JsPass;
use swc_ecma_utils::StmtLike;
use swc_ecma_visit::as_folder;
use swc_ecma_visit::noop_visit_mut_type;
use swc_ecma_visit::VisitMut;
use swc_ecma_visit::VisitMutWith;
use swc_ecma_visit::VisitWith;

mod drop_console;
mod hoist_decls;
mod optimize;

pub(crate) fn compressor<'a>(
    globals: &'a Globals,
    marks: Marks,
    options: &'a CompressOptions,
) -> impl 'a + JsPass {
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
    };

    chain!(console_remover, as_folder(compressor), expr_simplifier())
}

struct Compressor<'a> {
    globals: &'a Globals,
    marks: Marks,
    options: &'a CompressOptions,
    changed: bool,
    pass: usize,
    data: Option<ProgramData>,
    optimizer_state: OptimizerState,
    /// `0` means we should not create more threads.
    left_parallel_depth: u8,
}

impl CompilerPass for Compressor<'_> {
    fn name() -> Cow<'static, str> {
        "compressor".into()
    }
}

impl Compressor<'_> {
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
        N: Send + Sync + for<'aa> VisitMutWith<Compressor<'aa>>,
    {
        log::debug!("visit_par(left_depth = {})", self.left_parallel_depth);

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
        N: CompileUnit + VisitWith<UsageAnalyzer> + for<'aa> VisitMutWith<Compressor<'aa>>,
    {
        log::debug!(
            "Optimizing a compile unit within `{:?}`",
            thread::current().name()
        );

        {
            let data = analyze(&*n, self.marks);

            let mut v = decl_hoister(
                DeclHoisterConfig {
                    hoist_fns: self.options.hoist_fns,
                    hoist_vars: self.options.hoist_vars,
                    top_level: self.options.top_level(),
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

        let last_mark = n.remove_mark();
        assert!(
            N::is_module() || last_mark == self.marks.standalone,
            "{:?}; last={:?}",
            self.marks,
            last_mark
        );
    }

    /// Optimize a module. `N` can be [Module] or [FnExpr].
    fn optimize_unit<N>(&mut self, n: &mut N)
    where
        N: CompileUnit + VisitWith<UsageAnalyzer> + for<'aa> VisitMutWith<Compressor<'aa>>,
    {
        self.data = Some(analyze(&*n, self.marks));

        if self.options.passes != 0 && self.options.passes + 1 <= self.pass {
            let done = dump(&*n);
            log::debug!("===== Done =====\n{}", done);
            return;
        }

        // Temporary
        if self.pass > 30 {
            panic!("Infinite loop detected (current pass = {})", self.pass)
        }

        let start = if cfg!(feature = "debug") {
            let start = n.dump();
            log::debug!("===== Start =====\n{}", start);
            start
        } else {
            String::new()
        };

        {
            log::info!(
                "compress: Running expression simplifier (pass = {})",
                self.pass
            );

            let start_time = now();

            let mut visitor = expr_simplifier();
            n.apply(&mut visitor);
            self.changed |= visitor.changed();
            if visitor.changed() {
                log::debug!("compressor: Simplified expressions");
                if cfg!(feature = "debug") {
                    log::debug!("===== Simplified =====\n{}", dump(&*n));
                }
            }

            if let Some(start_time) = start_time {
                let end_time = Instant::now();

                log::info!(
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
            log::info!("compress: Running optimizer (pass = {})", self.pass);

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
            );
            n.apply(&mut visitor);
            self.changed |= visitor.changed();

            if let Some(start_time) = start_time {
                let end_time = Instant::now();

                log::info!(
                    "compress: Optimizer took {:?} (pass = {})",
                    end_time - start_time,
                    self.pass
                );
            }
            // let done = dump(&*n);
            // log::debug!("===== Result =====\n{}", done);
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

                log::info!(
                    "compress: dead_branch_remover took {:?} (pass = {})",
                    end_time - start_time,
                    self.pass
                );
            }

            if cfg!(feature = "debug") {
                let simplified = dump(&*n);

                if start != simplified {
                    log::debug!(
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

impl VisitMut for Compressor<'_> {
    noop_visit_mut_type!();

    fn visit_mut_fn_expr(&mut self, n: &mut FnExpr) {
        if n.function.span.has_mark(self.marks.standalone) {
            self.optimize_unit_repeatedly(n);
            return;
        }

        n.visit_mut_children_with(self);
    }

    fn visit_mut_module(&mut self, n: &mut Module) {
        let is_bundle_mode = n.span.has_mark(self.marks.bundle_of_standalones);

        if is_bundle_mode {
            self.left_parallel_depth = MAX_PAR_DEPTH - 1;
        } else {
            self.optimize_unit_repeatedly(n);
            return;
        }

        n.visit_mut_children_with(self);

        self.optimize_unit_repeatedly(n);

        invoke(&*n);
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
