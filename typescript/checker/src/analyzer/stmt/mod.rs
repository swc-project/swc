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
    pub fn visit_stmts_for_return(&mut self, stmts: &mut [Stmt]) -> Result<Option<Type>, Error> {
        log::debug!("visit_stmts_for_return()");

        let types = {
            // let order = self.reorder_stmts(&*stmts);
            // assert_eq!(order.len(), stmts.len());

            let mut v = ReturnTypeCollector {
                analyzer: &mut *self,
                types: Default::default(),
            };

            // for idx in order {
            //     stmts[idx].visit_mut_with(&mut v);
            // }

            stmts.visit_mut_children(&mut v);

            v.types
        };

        log::debug!("visit_stmts_for_return: types.len() = {}", types.len());

        let mut buf = Vec::with_capacity(types.len());
        for ty in types {
            buf.extend(ty.store(&mut self.info.errors));
        }

        if buf.is_empty() {
            return Ok(None);
        }

        Ok(Some(Type::union(buf)))
    }

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

struct ReturnTypeCollector<'a, A>
where
    A: VisitMut<Stmt> + Validate<Expr, Output = ValidationResult>,
{
    pub analyzer: &'a mut A,
    pub types: Vec<Result<Type, Error>>,
}

impl<A> VisitMut<ReturnStmt> for ReturnTypeCollector<'_, A>
where
    A: VisitMut<Stmt> + Validate<Expr, Output = ValidationResult>,
{
    fn visit_mut(&mut self, s: &mut ReturnStmt) {
        if let Some(ty) = s.arg.validate_with(self.analyzer) {
            self.types.push(ty)
        }
    }
}

impl<A> VisitMut<Stmt> for ReturnTypeCollector<'_, A>
where
    A: VisitMut<Stmt> + Validate<Expr, Output = ValidationResult>,
{
    fn visit_mut(&mut self, s: &mut Stmt) {
        self.analyzer.visit_mut(s);
        match s {
            Stmt::Return(..) => {
                s.visit_mut_children(self);
            }
            _ => {}
        }
    }
}

macro_rules! noop {
    ($T:ty) => {
        impl<A> VisitMut<$T> for ReturnTypeCollector<'_, A>
        where
            A: VisitMut<Stmt> + Validate<Expr, Output = ValidationResult>,
        {
            #[inline]
            fn visit_mut(&mut self, _: &mut $T) {}
        }
    };
}

noop!(Function);
noop!(ArrowExpr);
