pub(super) use self::ambient_decl::AmbientFunctionHandler;
use super::Analyzer;
use crate::{
    analyzer::{scope::ScopeKind, util::ResultExt},
    errors::Error,
    ty::Type,
    validator::{Validate, ValidateWith},
    ValidationResult,
};
use macros::validator;
use swc_common::{VisitMut, VisitMutWith};
use swc_ecma_ast::*;

mod ambient_decl;
mod decl;
mod loops;
mod return_type;

/// NOTE: We does **not** dig into with statements.
#[validator]
impl Validate<WithStmt> for Analyzer<'_, '_> {
    type Output = ValidationResult<()>;

    fn validate(&mut self, s: &mut WithStmt) -> Self::Output {
        s.obj.visit_mut_with(self);

        Ok(())
    }
}

#[validator]
impl Validate<BlockStmt> for Analyzer<'_, '_> {
    type Output = ValidationResult<()>;

    fn validate(&mut self, s: &mut BlockStmt) -> Self::Output {
        self.with_child(ScopeKind::Block, Default::default(), |analyzer| {
            s.stmts.visit_mut_with(analyzer)
        });

        Ok(())
    }
}

impl Analyzer<'_, '_> {
    /// Validate that parent interfaces are all resolved.
    pub fn resolve_parent_interfaces(&mut self, parents: &mut [TsExprWithTypeArgs]) {
        for parent in parents {
            // Verify parent interface
            let res: Result<_, _> = try {
                let type_args = try_opt!(parent.type_args.validate_with(self));
                self.type_of_ts_entity_name(parent.span, &parent.expr, type_args)?;
            };

            res.store(&mut self.info.errors);
        }
    }
}
