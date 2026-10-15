//! Runtime references to exported namespace bindings.

use rustc_hash::FxHashMap;
use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_utils::{ExprFactory, QueryRef};

pub(super) struct ExportQuery<'a> {
    pub(super) export_name: &'a FxHashMap<Id, Option<Id>>,
}

impl QueryRef for ExportQuery<'_> {
    fn query_ref(&self, export_name: &Ident) -> Option<Box<Expr>> {
        self.export_name
            .get(&export_name.to_id())?
            .clone()
            .map(|namespace_id| namespace_id.make_member(export_name.clone().into()).into())
    }

    fn query_lhs(&self, ident: &Ident) -> Option<Box<Expr>> {
        self.query_ref(ident)
    }

    fn query_jsx(&self, ident: &Ident) -> Option<JSXElementName> {
        self.export_name
            .get(&ident.to_id())?
            .clone()
            .map(|namespace_id| {
                JSXMemberExpr {
                    span: DUMMY_SP,
                    obj: JSXObject::Ident(namespace_id.into()),
                    prop: ident.clone().into(),
                }
                .into()
            })
    }
}
