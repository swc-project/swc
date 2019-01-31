use super::util::{local_name_for_src, make_require_call};
use crate::{
    helpers::Helpers,
    pass::Pass,
    util::{ExprFactory, PerPassVar},
};
use ast::*;
use fxhash::FxHashMap;
use std::sync::Arc;
use swc_atoms::JsWord;
use swc_common::{Fold, SyntaxContext, DUMMY_SP};

#[cfg(test)]
mod tests;

pub fn common_js(helpers: Arc<Helpers>) -> impl Pass + Clone {
    CommonJs {
        helpers,
        scope: Default::default(),
    }
}

#[derive(Clone, Default)]
struct Scope {
    /// Map from source file to ident
    ///
    /// e.g.
    ///  - `import { foo } from 'bar';`
    ///   -> `{'bar: _bar}`
    ///
    ///  - `import * as bar1 from 'bar';`
    ///   -> `{'bar`: bar1}`
    imports: FxHashMap<JsWord, (JsWord, SyntaxContext)>,

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

#[derive(Clone)]
struct CommonJs {
    helpers: Arc<Helpers>,
    scope: PerPassVar<Scope>,
}

impl Fold<Vec<ModuleItem>> for CommonJs {
    fn fold(&mut self, items: Vec<ModuleItem>) -> Vec<ModuleItem> {
        let mut buf = Vec::with_capacity(items.len() + 1);

        buf.push(ModuleItem::Stmt(Stmt::Expr(box Expr::Lit(Lit::Str(
            quote_str!("use strict"),
        )))));

        for item in items {
            match item {
                ModuleItem::ModuleDecl(ModuleDecl::Import(import)) => {
                    // add vars to self.scope
                    if import.specifiers.is_empty() {

                    } else if import.specifiers.len() == 1
                        && match import.specifiers[0] {
                            ImportSpecifier::Namespace(..) => true,
                            _ => false,
                        }
                    {
                        // import * as foo from 'src';
                        let specifier = match import.specifiers[0] {
                            ImportSpecifier::Namespace(ref ns) => ns,
                            _ => unreachable!(),
                        };

                        // Override if one exists
                        self.scope.imports.insert(
                            import.src.value.clone(),
                            (specifier.local.sym.clone(), specifier.local.span.ctxt()),
                        );
                    } else {
                        if !self.scope.imports.contains_key(&import.src.value) {
                            self.scope.imports.insert(
                                import.src.value.clone(),
                                (local_name_for_src(&import.src), SyntaxContext::empty()),
                            );
                        }

                        for s in &import.specifiers {
                            match *s {
                                ImportSpecifier::Namespace(..) => unreachable!(
                                    "import * as foo cannot be used with other type of import \
                                     specifiers"
                                ),
                                ImportSpecifier::Default(ref i) => {
                                    //
                                    self.scope.idents.insert(
                                        (i.local.sym.clone(), i.local.span.ctxt()),
                                        (import.src.value.clone(), js_word!("default")),
                                    );
                                }
                                ImportSpecifier::Specific(ref i) => {
                                    self.scope.idents.insert(
                                        (i.local.sym.clone(), i.local.span.ctxt()),
                                        (import.src.value.clone(), js_word!("default")),
                                    );
                                }
                            }
                        }
                    }
                }
                _ => buf.push(item),
            }
        }

        buf
    }
}

impl CommonJs {
    fn fold_module_decl(&mut self, buf: &mut Vec<ModuleItem>, item: ModuleDecl) {
        match item {
            ModuleDecl::Import(mut import) => {
                let require = box make_require_call(import.src);

                if import.specifiers.is_empty() {
                    // import 'foo';
                    //   -> require('foo');
                    buf.push(ModuleItem::Stmt(Stmt::Expr(require)));
                    return;
                }

                if import.specifiers.len() == 1
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

                    self.helpers.interop_require_wildcard();
                    let rhs = Expr::Call(CallExpr {
                        span: DUMMY_SP,
                        callee: quote_ident!("_interopRequireWildcard").as_callee(),
                        args: vec![require.as_arg()],
                        type_args: Default::default(),
                    });

                    buf.push(ModuleItem::Stmt(Stmt::Decl(Decl::Var(VarDecl {
                        span: import.span,
                        kind: VarDeclKind::Var,
                        decls: vec![VarDeclarator {
                            span: DUMMY_SP,
                            name: Pat::Ident(specifier.local),
                            init: Some(box rhs),
                            definite: false,
                        }],
                        declare: false,
                    }))));
                    return;
                }
            }
            _ => buf.push(ModuleItem::ModuleDecl(item)),
        }
    }
}
