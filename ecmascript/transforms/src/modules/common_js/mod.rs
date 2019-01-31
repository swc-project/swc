use super::util::{local_name_for_src, make_require_call};
use crate::{
    helpers::Helpers,
    pass::Pass,
    util::{ExprFactory, State},
};
use ast::*;
use fxhash::FxHashMap;
use std::sync::Arc;
use swc_atoms::JsWord;
use swc_common::{Fold, FoldWith, Span, SyntaxContext, DUMMY_SP};

#[cfg(test)]
mod tests;

pub fn common_js(helpers: Arc<Helpers>) -> impl Pass + Clone {
    CommonJs {
        helpers,
        scope: Default::default(),
    }
}

#[derive(Clone)]
struct CommonJs {
    helpers: Arc<Helpers>,
    scope: State<Scope>,
}

#[derive(Clone, Default)]
struct Scope {
    /// Map from source file to ident
    ///
    /// e.g.
    ///
    ///  - `import 'foo'`
    ///   -> `{'foo': None}`
    ///
    ///  - `import { foo } from 'bar';`
    ///   -> `{'bar': Some(_bar)}`
    ///
    ///  - `import * as bar1 from 'bar';`
    ///   -> `{'bar': Some(bar1)}`
    imports: FxHashMap<JsWord, Option<(JsWord, Span)>>,
    ///
    /// - `true` is wildcard (`_interopRequireWildcard`)
    /// - `false` is default (`_interopRequireDefault`)
    import_types: FxHashMap<JsWord, bool>,

    /// Map from imported ident to (source file, property name).
    ///
    /// e.g.
    ///  - `import { foo } from 'bar';`
    ///   -> `{foo: ('bar', foo)}`
    ///
    ///  - `import foo from 'bar';`
    ///   -> `{foo: ('bar', default)}`
    idents: FxHashMap<(JsWord, SyntaxContext), (JsWord, JsWord)>,
}

impl Fold<Vec<ModuleItem>> for CommonJs {
    fn fold(&mut self, items: Vec<ModuleItem>) -> Vec<ModuleItem> {
        let mut stmts = Vec::with_capacity(items.len() + 1);
        let mut extra_stmts = Vec::with_capacity(items.len() + 1);

        stmts.push(ModuleItem::Stmt(Stmt::Expr(box Expr::Lit(Lit::Str(
            quote_str!("use strict"),
        )))));

        for item in items {
            match item {
                ModuleItem::ModuleDecl(ModuleDecl::Import(mut import)) => {
                    if import.specifiers.is_empty() {
                        // import 'foo';
                        //   -> require('foo');
                        self.scope.imports.insert(import.src.value.clone(), None);
                    } else if import.specifiers.len() == 1
                        && match import.specifiers[0] {
                            ImportSpecifier::Namespace(..) => true,
                            _ => false,
                        }
                    {
                        // import * as foo from 'src';
                        let specifier = match import.specifiers.pop().unwrap() {
                            ImportSpecifier::Namespace(ns) => ns,
                            _ => unreachable!(),
                        };

                        // Override if one exists
                        self.scope.imports.insert(
                            import.src.value.clone(),
                            Some((specifier.local.sym.clone(), specifier.local.span)),
                        );
                        self.scope.import_types.insert(import.src.value, true);
                    } else {
                        if !self.scope.imports.contains_key(&import.src.value) {
                            self.scope.imports.insert(
                                import.src.value.clone(),
                                Some((local_name_for_src(&import.src), DUMMY_SP)),
                            );
                        }

                        for s in import.specifiers {
                            match s {
                                ImportSpecifier::Namespace(..) => unreachable!(
                                    "import * as foo cannot be used with other type of import \
                                     specifiers"
                                ),
                                ImportSpecifier::Default(i) => {
                                    //
                                    self.scope.idents.insert(
                                        (i.local.sym.clone(), i.local.span.ctxt()),
                                        (import.src.value.clone(), js_word!("default")),
                                    );
                                    self.scope
                                        .import_types
                                        .entry(import.src.value.clone())
                                        .or_insert(false);
                                }
                                ImportSpecifier::Specific(i) => {
                                    let ImportSpecific {
                                        local, imported, ..
                                    } = i;
                                    let name = imported
                                        .map(|i| i.sym)
                                        .unwrap_or_else(|| local.sym.clone());
                                    let is_default = name == js_word!("default");

                                    self.scope.idents.insert(
                                        (local.sym.clone(), local.span.ctxt()),
                                        (import.src.value.clone(), name),
                                    );

                                    if is_default {
                                        self.scope
                                            .import_types
                                            .entry(import.src.value.clone())
                                            .or_insert(false);
                                    } else {
                                        self.scope
                                            .import_types
                                            .entry(import.src.value.clone())
                                            .and_modify(|v| *v = true);
                                    }
                                }
                            }
                        }
                    }
                }
                _ => extra_stmts.push(item.fold_with(self)),
            }
        }

        for (src, import) in self.scope.value.imports.drain() {
            let require = make_require_call(src.clone());

            match import {
                Some(import) => {
                    let ty = self.scope.value.import_types.get(&src);

                    let rhs = match ty {
                        Some(true) => {
                            self.helpers.interop_require_wildcard();
                            box Expr::Call(CallExpr {
                                span: DUMMY_SP,
                                callee: quote_ident!("_interopRequireWildcard").as_callee(),
                                args: vec![require.as_arg()],
                                type_args: Default::default(),
                            })
                        }
                        Some(false) => {
                            self.helpers.interop_require_default();
                            box Expr::Call(CallExpr {
                                span: DUMMY_SP,
                                callee: quote_ident!("_interopRequireDefault").as_callee(),
                                args: vec![require.as_arg()],
                                type_args: Default::default(),
                            })
                        }
                        _ => box require,
                    };

                    stmts.push(ModuleItem::Stmt(Stmt::Decl(Decl::Var(VarDecl {
                        span: import.1,
                        kind: VarDeclKind::Var,
                        decls: vec![VarDeclarator {
                            span: DUMMY_SP,
                            name: Pat::Ident(Ident::new(import.0, import.1)),
                            init: Some(rhs),
                            definite: false,
                        }],
                        declare: false,
                    }))));
                }
                None => {
                    stmts.push(ModuleItem::Stmt(Stmt::Expr(box require)));
                }
            }
        }

        stmts.append(&mut extra_stmts);

        stmts
    }
}

impl Fold<Expr> for CommonJs {
    fn fold(&mut self, expr: Expr) -> Expr {
        match expr {
            Expr::Ident(i) => {
                let v = self.scope.value.idents.get(&(i.sym.clone(), i.span.ctxt()));
                match v {
                    None => return Expr::Ident(i),
                    Some((src, prop)) => {
                        let (ident, span) = self
                            .scope
                            .value
                            .imports
                            .get(src)
                            .as_ref()
                            .unwrap()
                            .as_ref()
                            .unwrap();
                        Expr::Member(MemberExpr {
                            span: DUMMY_SP,
                            obj: Ident::new(ident.clone(), *span).as_obj(),
                            prop: box Expr::Ident(Ident::new(prop.clone(), DUMMY_SP)),
                            computed: false,
                        })
                    }
                }
            }
            Expr::Member(e) => {
                if e.computed {
                    Expr::Member(MemberExpr {
                        obj: e.obj.fold_with(self),
                        prop: e.prop.fold_with(self),
                        ..e
                    })
                } else {
                    Expr::Member(MemberExpr {
                        obj: e.obj.fold_with(self),
                        ..e
                    })
                }
            }
            _ => expr.fold_children(self),
        }
    }
}
