use dashmap::DashMap;
use once_cell::sync::Lazy;
use std::{collections::HashMap, sync::Arc};
use swc_atoms::JsWord;
use swc_common::{sync::Lrc, util::move_map::MoveMap, FileName, SourceMap};
use swc_ecma_ast::*;
use swc_ecma_parser::{lexer::Lexer, Parser, StringInput};
use swc_ecma_utils::drop_span;
use swc_ecma_utils::HANDLER;
use swc_ecma_visit::{noop_fold_type, Fold, FoldWith};

pub fn const_modules(
    cm: Lrc<SourceMap>,
    globals: HashMap<JsWord, HashMap<JsWord, String>>,
) -> impl Fold {
    ConstModules {
        globals: globals
            .into_iter()
            .map(|(src, map)| {
                let map = map
                    .into_iter()
                    .map(|(key, value)| {
                        let value = parse_option(&cm, &key, value);

                        (key, value)
                    })
                    .collect();

                (src, map)
            })
            .collect(),
        scope: Default::default(),
    }
}

fn parse_option(cm: &SourceMap, name: &str, src: String) -> Arc<Expr> {
    static CACHE: Lazy<DashMap<String, Arc<Expr>>> = Lazy::new(|| DashMap::default());

    let fm = cm.new_source_file(FileName::Custom(format!("<const-module-{}.js>", name)), src);
    if let Some(expr) = CACHE.get(&**fm.src) {
        return expr.clone();
    }

    let lexer = Lexer::new(
        Default::default(),
        Default::default(),
        StringInput::from(&*fm),
        None,
    );
    let expr = Parser::new_from(lexer)
        .parse_expr()
        .map_err(|e| {
            if HANDLER.is_set() {
                HANDLER.with(|h| e.into_diagnostic(h).emit())
            }
        })
        .map(drop_span)
        .unwrap_or_else(|()| {
            panic!(
                "failed to parse jsx option {}: '{}' is not an expression",
                name, fm.src,
            )
        });

    let expr = Arc::new(*expr);

    CACHE.insert((*fm.src).clone(), expr.clone());

    expr
}

struct ConstModules {
    globals: HashMap<JsWord, HashMap<JsWord, Arc<Expr>>>,
    scope: Scope,
}

#[derive(Default)]
struct Scope {
    imported: HashMap<JsWord, Arc<Expr>>,
}

impl Fold for ConstModules {
    noop_fold_type!();

    fn fold_module_items(&mut self, items: Vec<ModuleItem>) -> Vec<ModuleItem> {
        items.move_flat_map(|item| match item {
            ModuleItem::ModuleDecl(ModuleDecl::Import(import)) => {
                let entry = self.globals.get(&import.src.value);

                if let Some(entry) = entry {
                    for s in &import.specifiers {
                        let i = match *s {
                            ImportSpecifier::Named(ref s) => &s.local,
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
                        self.scope.imported.insert(i.sym.clone(), value);
                    }

                    None
                } else {
                    Some(ModuleItem::ModuleDecl(ModuleDecl::Import(import)))
                }
            }
            _ => Some(item.fold_with(self)),
        })
    }

    fn fold_expr(&mut self, expr: Expr) -> Expr {
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
            _ => expr.fold_children_with(self),
        };
        match expr {
            Expr::Ident(Ident { ref sym, .. }) => {
                // It's ok because we don't recurse into member expressions.
                if let Some(value) = self.scope.imported.get(sym) {
                    (**value).clone()
                } else {
                    expr
                }
            }
            _ => expr,
        }
    }
}
