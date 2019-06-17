use super::{expr::never_ty, scope::ScopeKind, Analyzer};
use swc_common::{Visit, VisitWith};
use swc_ecma_ast::*;

impl Analyzer<'_, '_> {
    fn visit_flow<F>(&mut self, op: F)
    where
        F: for<'a, 'b> FnOnce(&mut Analyzer<'a, 'b>),
    {
        let errors = {
            let mut child = self.child(ScopeKind::Flow);

            op(&mut child);

            assert_eq!(
                child.info.exports,
                Default::default(),
                "Child node cannot export"
            );
            child.info.errors
        };

        self.info.errors.extend(errors);
    }
}

impl Visit<IfStmt> for Analyzer<'_, '_> {
    fn visit(&mut self, stmt: &IfStmt) {
        self.visit_flow(|child| {
            //
            stmt.visit_children(child)
        });
    }
}

pub(super) trait RemoveTypes {
    /// Removes falsy values from `self`.
    fn remove_falsy(self) -> TsType;
}
impl RemoveTypes for TsType {
    fn remove_falsy(self) -> TsType {
        match self {
            TsType::TsUnionOrIntersectionType(n) => n.remove_falsy().into(),
            TsType::TsKeywordType(TsKeywordType { kind, span }) => match kind {
                TsKeywordTypeKind::TsUndefinedKeyword | TsKeywordTypeKind::TsNullKeyword => {
                    never_ty(span)
                }
                _ => self,
            },
            _ => self,
        }
    }
}

impl RemoveTypes for TsUnionOrIntersectionType {
    fn remove_falsy(self) -> TsType {
        match self {
            TsUnionOrIntersectionType::TsIntersectionType(n) => n.remove_falsy().into(),
            TsUnionOrIntersectionType::TsUnionType(n) => n.remove_falsy().into(),
        }
    }
}

impl RemoveTypes for TsIntersectionType {
    fn remove_falsy(self) -> TsType {
        let types = self
            .types
            .into_iter()
            .map(|ty| ty.remove_falsy())
            .map(Box::new)
            .collect::<Vec<_>>();
        if types.iter().any(|ty| is_never(&ty)) {
            return TsType::TsKeywordType(TsKeywordType {
                span: self.span,
                kind: TsKeywordTypeKind::TsNeverKeyword,
            });
        }

        TsType::TsUnionOrIntersectionType(TsIntersectionType { types, ..self }.into())
    }
}

impl RemoveTypes for TsUnionType {
    fn remove_falsy(self) -> TsType {
        let types = self
            .types
            .into_iter()
            .map(|ty| ty.remove_falsy())
            .filter(|ty| !is_never(&ty))
            .map(Box::new)
            .collect();

        TsType::TsUnionOrIntersectionType(TsUnionType { types, ..self }.into())
    }
}

impl RemoveTypes for Box<TsType> {
    fn remove_falsy(self) -> TsType {
        (*self).remove_falsy()
    }
}

fn is_never(ty: &TsType) -> bool {
    match *ty {
        TsType::TsKeywordType(TsKeywordType {
            kind: TsKeywordTypeKind::TsNeverKeyword,
            ..
        }) => false,
        _ => true,
    }
}
