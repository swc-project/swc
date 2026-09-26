use rustc_hash::FxHashMap;
use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_utils::{private_ident, ExprFactory, IdentRenamer, IdentUsageFinder};
use swc_ecma_visit::VisitMutWith;

/// Class body references follow the replacement returned by a legacy decorator.
/// Keep the class's own name binding for heritage expressions and computed
/// keys, matching TypeScript, and leave shadowed bindings untouched.
pub(super) fn alias_class_references(class: &mut Class, name: &Ident) -> Option<Ident> {
    let alias = private_ident!(format!("_{}", name.sym));
    let mut replacements = FxHashMap::default();
    replacements.insert(name.to_id(), alias.to_id());
    let mut used = false;

    macro_rules! rewrite {
        ($node:expr) => {
            if IdentUsageFinder::find(name, &$node) {
                $node.visit_mut_with(&mut IdentRenamer::new(&replacements));
                used = true;
            }
        };
    }

    for member in &mut class.body {
        match member {
            ClassMember::Constructor(c) => {
                rewrite!(c.params);
                rewrite!(c.body);
            }
            ClassMember::Method(m) => {
                rewrite!(m.function.params);
                rewrite!(m.function.body);
            }
            ClassMember::PrivateMethod(m) => {
                rewrite!(m.function.params);
                rewrite!(m.function.body);
            }
            ClassMember::ClassProp(p) => rewrite!(p.value),
            ClassMember::PrivateProp(p) => rewrite!(p.value),
            ClassMember::StaticBlock(b) => rewrite!(b.body),
            ClassMember::AutoAccessor(a) => rewrite!(a.value),
            _ => {}
        }
    }

    if !used {
        return None;
    }

    // Initialize before user static fields/blocks, which can call methods that
    // reference the class. The surrounding alias is updated after decoration.
    class.body.insert(
        0,
        StaticBlock {
            span: DUMMY_SP,
            body: BlockStmt {
                stmts: vec![AssignExpr {
                    span: DUMMY_SP,
                    op: op!("="),
                    left: alias.clone().into(),
                    right: ThisExpr { span: DUMMY_SP }.into(),
                }
                .into_stmt()],
                ..Default::default()
            },
        }
        .into(),
    );

    Some(alias)
}
