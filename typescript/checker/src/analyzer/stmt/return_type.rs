use crate::{
    analyzer::{util::ResultExt, Analyzer},
    errors::Error,
    ty::Type,
    validator::{Validate, ValidateWith},
    ValidationResult,
};
use swc_common::{VisitMut, VisitMutWith};
use swc_ecma_ast::*;

impl Analyzer<'_, '_> {
    pub(in crate::analyzer) fn visit_stmts_for_return(
        &mut self,
        stmts: &mut [Stmt],
    ) -> Result<Option<Type>, Error> {
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
}

struct ReturnTypeCollector<'a, A>
where
    A: VisitMut<Stmt> + Validate<Expr, Output = ValidationResult>,
{
    pub analyzer: &'a mut A,
    pub types: Vec<Result<Type, Error>>,
}

impl<A> VisitMut<Expr> for ReturnTypeCollector<'_, A>
where
    A: VisitMut<Stmt> + Validate<Expr, Output = ValidationResult>,
{
    fn visit_mut(&mut self, e: &mut Expr) {
        let ty: Result<_, Error> = try {
            let ty = e.validate_with(self.analyzer)?;
            match ty.normalize() {
                Type::Keyword(TsKeywordType {
                    kind: TsKeywordTypeKind::TsNeverKeyword,
                    ..
                }) => {
                    log::info!("found never type");
                    self.types.push(Ok(ty))
                }
                _ => {}
            }

            ()
        };

        match ty {
            Ok(()) => {}
            Err(err) => self.types.push(Err(err)),
        }
    }
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
