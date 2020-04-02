use crate::{
    pass::Pass,
    util::{
        drop_span,
        options::{CM, SESSION},
    },
};
use dashmap::DashMap;
use once_cell::sync::Lazy;
use std::{collections::HashMap, sync::Arc};
use swc_atoms::JsWord;
use swc_common::{util::move_map::MoveMap, FileName, Fold, FoldWith};
use swc_ecma_ast::*;
use swc_ecma_parser::{lexer::Lexer, Parser, SourceFileInput};

pub fn const_modules(globals: HashMap<JsWord, HashMap<JsWord, String>>) -> impl Pass {
    ConstModules {
        globals: globals
            .into_iter()
            .map(|(src, map)| {
                let map = map
                    .into_iter()
                    .map(|(key, value)| {
                        let value = parse_option(&key, value);

                        (key, value)
                    })
                    .collect();

                (src, map)
            })
            .collect(),
        scope: Default::default(),
    }
}

fn parse_option(name: &str, src: String) -> Arc<Expr> {
    static CACHE: Lazy<DashMap<Arc<String>, Arc<Expr>>> = Lazy::new(|| DashMap::default());

    let fm = CM.new_source_file(FileName::Custom(format!("<const-module-{}.js>", name)), src);
    if let Some(expr) = CACHE.get(&fm.src) {
        return expr.clone();
    }

    let lexer = Lexer::new(
        *SESSION,
        Default::default(),
        Default::default(),
        SourceFileInput::from(&*fm),
        None,
    );
    let expr = Parser::new_from(*SESSION, lexer)
        .parse_expr()
        .map_err(|mut e| {
            e.emit();
        })
        .map(drop_span)
        .unwrap_or_else(|()| {
            panic!(
                "faield to parse jsx option {}: '{}' is not an expression",
                name, fm.src,
            )
        });

    let expr = Arc::new(*expr);

    CACHE.insert(fm.src.clone(), expr.clone());

    expr
}

struct ConstModules {
    globals: HashMap<JsWord, HashMap<JsWord, Arc<Expr>>>,
    scope: Scope,
}

noop_fold_type!(ConstModules);

#[derive(Default)]
struct Scope {
    imported: HashMap<JsWord, Arc<Expr>>,
}

impl Fold<Vec<ModuleItem>> for ConstModules
where
    Vec<ModuleItem>: FoldWith<Self>,
{
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
                    (**value).clone()
                } else {
                    expr
                }
            }
            _ => expr,
        }
    }
}
