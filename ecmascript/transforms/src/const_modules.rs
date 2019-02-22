use crate::{pass::Pass, util::State};
use ast::*;
use fxhash::FxHashMap;
use std::sync::Arc;
use swc_atoms::JsWord;
use swc_common::{util::move_map::MoveMap, Fold, FoldWith};

pub fn const_modules(
    globals: FxHashMap<JsWord, FxHashMap<JsWord, Arc<Expr>>>,
) -> impl Pass + Clone {
    ConstModules {
        globals,
        scope: Default::default(),
    }
}

#[derive(Clone)]
struct ConstModules {
    globals: FxHashMap<JsWord, FxHashMap<JsWord, Arc<Expr>>>,
    scope: State<Scope>,
}

#[derive(Default)]
struct Scope {
    imported: FxHashMap<JsWord, Arc<Expr>>,
}

impl Fold<Vec<ModuleItem>> for ConstModules {
    fn fold(&mut self, items: Vec<ModuleItem>) -> Vec<ModuleItem> {
        items.move_flat_map(|item| match item {
            ModuleItem::ModuleDecl(ModuleDecl::Import(import)) => {
                let entry = self.globals.get(&import.src.value);

                if let Some(entry) = entry {
                    for s in &import.specifiers {
                        let i = match *s {
                            ImportSpecifier::Specific(ref s) => &s.local,
                            ImportSpecifier::Namespace(..) => unimplemented!(
                                "const modules does not support namespace import yet"
                            ),
                            ImportSpecifier::Default(..) => {
                                panic!("const_modules does not support default import")
                            }
                        };
                        let value = entry.get(&i.sym).cloned().unwrap_or_else(|| {
                            panic!(
                                "const_modules: {} does not contain flags named {}",
                                import.src.value, i.sym
                            )
                        });
                        self.scope.value.imported.insert(i.sym.clone(), value);
                    }

                    None
                } else {
                    Some(ModuleItem::ModuleDecl(ModuleDecl::Import(import)))
                }
            }
            _ => Some(item.fold_with(self)),
        })
    }
}

impl Fold<Expr> for ConstModules {
    fn fold(&mut self, expr: Expr) -> Expr {
        let expr = match expr {
            Expr::Member(expr) => {
                if expr.computed {
                    Expr::Member(MemberExpr {
                        obj: expr.obj.fold_with(self),
                        prop: expr.prop.fold_with(self),
                        ..expr
                    })
                } else {
                    Expr::Member(MemberExpr {
                        obj: expr.obj.fold_with(self),
                        ..expr
                    })
                }
            }
            _ => expr.fold_children(self),
        };
        match expr {
            Expr::Ident(Ident { ref sym, .. }) => {
                // It's ok because we don't recurse into member expressions.
                if let Some(value) = self.scope.imported.get(sym) {
                    return (**value).clone();
                } else {
                    expr
                }
            }
            _ => expr,
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::tests::Tester;

    fn tr(tester: &mut Tester, sources: &[(&str, &[(&str, &str)])]) -> impl Fold<Module> {
        let mut m = FxHashMap::default();

        for (src, values) in sources {
            let values = values
                .iter()
                .map(|(k, v)| {
                    let mut v = tester
                        .apply_transform(
                            ::testing::DropSpan,
                            "global.js",
                            ::swc_ecma_parser::Syntax::default(),
                            v,
                        )
                        .unwrap();
                    let v = match v.body.pop().unwrap() {
                        ModuleItem::Stmt(Stmt::Expr(box expr)) => expr,
                        _ => unreachable!(),
                    };

                    ((*k).into(), Arc::new(v))
                })
                .collect();

            m.insert((*src).into(), values);
        }

        const_modules(m)
    }

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |tester| tr(tester, &[("@ember/env-flags", &[("DEBUG", "true")])]),
        simple_flags,
        r#"import { DEBUG } from '@ember/env-flags';
        if (DEBUG) {
            console.log('Foo!');
        }"#,
        r#"
        if (true) {
            console.log('Foo!');
        }"#
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |tester| tr(
            tester,
            &[
                ("@ember/env-flags", &[("DEBUG", "true")]),
                (
                    "@ember/features",
                    &[("FEATURE_A", "false"), ("FEATURE_B", "true")]
                )
            ]
        ),
        complex_multiple,
        "
import { DEBUG } from '@ember/env-flags';
import { FEATURE_A, FEATURE_B } from '@ember/features';
if (DEBUG) {
    console.log('Foo!');
}

let woot;
if (FEATURE_A) {
  woot = () => 'woot';
} else if (FEATURE_B) {
  woot = () => 'toow';
}
",
        "
if (true) {
    console.log('Foo!');
}

let woot;
if (false) {
  woot = () => 'woot';
} else if (true) {
  woot = () => 'toow';
}
"
    );
}
