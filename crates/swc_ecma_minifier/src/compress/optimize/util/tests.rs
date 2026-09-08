use rustc_hash::{FxHashMap, FxHashSet};
use swc_common::{Globals, SyntaxContext, DUMMY_SP, GLOBALS};
use swc_ecma_ast::*;
use swc_ecma_visit::VisitMutWith;

use super::Finalizer;

fn cloned_arrow_param_ctxt(prop: &Prop, original_ctxt: SyntaxContext) -> SyntaxContext {
    let Prop::KeyValue(KeyValueProp {
        key: PropName::Ident(key),
        value,
    }) = prop
    else {
        panic!("expected shorthand to be expanded into a key-value property");
    };
    assert_eq!(key.sym, *"inline_value");

    let Expr::Arrow(arrow) = &**value else {
        panic!("expected the shorthand value to be the cloned arrow");
    };
    let Pat::Ident(param) = &arrow.params[0] else {
        panic!("expected an identifier parameter");
    };
    let ArrowFunctionBody::Expr(body) = &*arrow.body else {
        panic!("expected an expression-bodied arrow");
    };
    let Expr::Ident(reference) = &**body else {
        panic!("expected the arrow body to reference its parameter");
    };

    assert_ne!(param.id.ctxt, original_ctxt);
    assert_eq!(reference.to_id(), param.id.to_id());

    param.id.ctxt
}

#[test]
fn freshens_arrow_bindings_cloned_into_object_shorthands() {
    GLOBALS.set(&Globals::new(), || {
        let inline_ident = Ident::new_private("inline_value".into(), DUMMY_SP);
        let param = Ident::new_private("param".into(), DUMMY_SP);
        let original_ctxt = param.ctxt;

        let mut lits = FxHashMap::default();
        lits.insert(
            inline_ident.to_id(),
            Box::new(Expr::Arrow(ArrowExpr {
                params: vec![Pat::Ident(param.clone().into())],
                body: Box::new(ArrowFunctionBody::Expr(Box::new(param.into()))),
                ..Default::default()
            })),
        );

        let empty_exprs = FxHashMap::default();
        let hoisted_props = FxHashMap::default();
        let vars_to_remove = FxHashSet::default();
        let mut finalizer = Finalizer {
            simple_functions: &empty_exprs,
            lits: &lits,
            lits_for_cmp: &empty_exprs,
            lits_for_array_access: &empty_exprs,
            hoisted_props: &hoisted_props,
            vars_to_remove: &vars_to_remove,
            changed: false,
        };
        let mut props = vec![
            Prop::Shorthand(inline_ident.clone()),
            Prop::Shorthand(inline_ident),
        ];

        for prop in &mut props {
            prop.visit_mut_with(&mut finalizer);
        }

        assert!(finalizer.changed);
        let first_ctxt = cloned_arrow_param_ctxt(&props[0], original_ctxt);
        let second_ctxt = cloned_arrow_param_ctxt(&props[1], original_ctxt);
        assert_ne!(first_ctxt, second_ctxt);
    });
}
