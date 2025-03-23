use std::{borrow::Cow, time::Instant};

#[cfg(feature = "pretty_assertions")]
use pretty_assertions::assert_eq;
use swc_common::pass::{CompilerPass, Optional, Repeated};
use swc_ecma_ast::*;
use swc_ecma_transforms_optimization::simplify::{expr_simplifier, ExprSimplifierConfig};
use swc_ecma_usage_analyzer::marks::Marks;
#[cfg(debug_assertions)]
use swc_ecma_visit::VisitWith;
use swc_ecma_visit::{visit_mut_pass, VisitMutWith};
use swc_timer::timer;
use tracing::debug;

pub(crate) use self::pure::{pure_optimizer, PureOptimizerConfig};
use self::{hoist_decls::DeclHoisterConfig, optimize::optimizer};
#[cfg(debug_assertions)]
use crate::debug::AssertValid;
use crate::{
    compress::hoist_decls::decl_hoister,
    debug::dump,
    mode::Mode,
    option::{CompressOptions, MangleOptions},
    program_data::analyze,
    util::{force_dump_program, now},
};

mod hoist_decls;
mod optimize;
mod pure;
mod util;

pub(crate) fn compressor<'a, M>(
    marks: Marks,
    options: &'a CompressOptions,
    mangle_options: Option<&'a MangleOptions>,
    mode: &'a M,
) -> impl 'a + Pass
where
    M: Mode,
{
    let compressor = Compressor {
        marks,
        options,
        mangle_options,
        changed: false,
        pass: 1,
        mode,
    };

    (
        compressor,
        Optional {
            enabled: options.evaluate || options.side_effects,
            visitor: visit_mut_pass(expr_simplifier(
                marks.unresolved_mark,
                ExprSimplifierConfig {},
            )),
        },
    )
}

struct Compressor<'a> {
    marks: Marks,
    options: &'a CompressOptions,
    mangle_options: Option<&'a MangleOptions>,
    changed: bool,
    pass: usize,

    mode: &'a dyn Mode,
}

impl CompilerPass for Compressor<'_> {
    fn name(&self) -> Cow<'static, str> {
        "compressor".into()
    }
}

impl Pass for Compressor<'_> {
    fn process(&mut self, program: &mut Program) {
        self.optimize_unit_repeatedly(program);
    }
}

impl Compressor<'_> {
    fn optimize_unit_repeatedly(&mut self, n: &mut Program) {
        trace_op!(
            "Optimizing a compile unit within `{:?}`",
            thread::current().name()
        );

        if self.options.hoist_vars || self.options.hoist_fns {
            let data = analyze(&*n, Some(self.marks));

            let mut v = decl_hoister(
                DeclHoisterConfig {
                    hoist_fns: self.options.hoist_fns,
                    hoist_vars: self.options.hoist_vars,
                    _top_level: self.options.top_level(),
                },
                &data,
            );
            n.visit_mut_with(&mut v);
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

        self.pass = 1;
        // let last_mark = n.remove_mark();
        // assert!(
        //     N::is_module() || last_mark == self.marks.standalone,
        //     "{:?}; last={:?}",
        //     self.marks,
        //     last_mark
        // );
    }

    /// Optimize a module. `N` can be [Module] or [FnExpr].
    fn optimize_unit(&mut self, n: &mut Program) {
        let _timer = timer!("optimize", pass = self.pass);

        if self.options.passes != 0 && self.options.passes < self.pass {
            let done = dump(&*n, false);
            debug!("===== Done =====\n{}", done);
            return;
        }

        // This exists to prevent hanging.
        if self.pass > 200 {
            let code = force_dump_program(n);

            panic!(
                "Infinite loop detected (current pass = {})\n{}",
                self.pass, code
            );
        }

        #[cfg(feature = "debug")]
        let start = {
            let start = force_dump_program(n);
            debug!("===== Start =====\n{}", start);
            start
        };

        {
            let _timer = timer!("apply pure optimizer");

            let mut visitor = pure_optimizer(
                self.options,
                self.marks,
                PureOptimizerConfig {
                    enable_join_vars: self.pass > 1,
                    force_str_for_tpl: self.mode.force_str_for_tpl(),
                },
            );
            n.visit_mut_with(&mut visitor);

            self.changed |= visitor.changed();

            #[cfg(feature = "debug")]
            if visitor.changed() {
                let src = force_dump_program(n);
                debug!(
                    "===== Before pure =====\n{}\n===== After pure =====\n{}",
                    start, src
                );
            }
        }

        {
            tracing::info!(
                "compress: Running expression simplifier (pass = {})",
                self.pass
            );

            let start_time = now();

            #[cfg(feature = "debug")]
            let start = force_dump_program(n);

            let mut visitor = expr_simplifier(self.marks.unresolved_mark, ExprSimplifierConfig {});
            n.visit_mut_with(&mut visitor);

            self.changed |= visitor.changed();
            if visitor.changed() {
                debug!("compressor: Simplified expressions");
                #[cfg(feature = "debug")]
                {
                    debug!(
                        "===== Simplified =====\n{start}===== ===== ===== =====\n{}",
                        force_dump_program(n)
                    );
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
        }

        #[cfg(debug_assertions)]
        {
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
                self.mangle_options,
                &mut data,
                self.mode,
            );
            n.visit_mut_with(&mut visitor);

            self.changed |= visitor.changed();

            // let done = dump(&*n);
            // debug!("===== Result =====\n{}", done);
        }
    }
}
