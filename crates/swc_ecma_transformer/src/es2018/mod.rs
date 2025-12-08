use swc_ecma_ast::Program;
use swc_ecma_hooks::VisitMutHook;
use swc_ecma_transforms_base::assumptions::Assumptions;
use swc_ecma_visit::VisitMutWith;

use crate::TraverseCtx;

mod object_rest_spread;

pub use object_rest_spread::Config as ObjectRestSpreadConfig;

#[derive(Debug, Default)]
#[non_exhaustive]
pub struct Es2018Options {
    pub object_rest_spread: bool,
}

pub fn hook(options: Es2018Options, assumptions: Assumptions) -> impl VisitMutHook<TraverseCtx> {
    Es2018Pass {
        options,
        assumptions,
    }
}

struct Es2018Pass {
    options: Es2018Options,
    assumptions: Assumptions,
}

impl VisitMutHook<TraverseCtx> for Es2018Pass {
    fn enter_program(&mut self, program: &mut Program, _ctx: &mut TraverseCtx) {
        if self.options.object_rest_spread {
            let config = ObjectRestSpreadConfig {
                no_symbol: self.assumptions.object_rest_no_symbols,
                set_property: self.assumptions.set_spread_properties,
                pure_getters: self.assumptions.pure_getters,
            };

            let mut rest = object_rest_spread::ObjectRest::new(config);
            program.visit_mut_with(&mut rest);

            let mut spread = object_rest_spread::ObjectSpread { config };
            program.visit_mut_with(&mut spread);
        }
    }
}
