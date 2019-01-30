use super::util::{make_require_call, Folder, ModuleSystem};
use crate::{helpers::Helpers, pass::Pass, util::ExprFactory};
use ast::*;
use std::sync::Arc;
use swc_common::{Fold, Span, DUMMY_SP};

#[cfg(test)]
mod tests;

pub fn common_js(helpers: Arc<Helpers>) -> impl Pass + Clone {
    Folder::new(CommonJs { helpers })
}

#[derive(Clone)]
struct CommonJs {
    helpers: Arc<Helpers>,
}

impl ModuleSystem for CommonJs {
    fn fold_module_item(&mut self, buf: &mut Vec<ModuleItem>, item: ModuleItem) {
        match item {
            ModuleItem::ModuleDecl(ModuleDecl::Import(mut import)) => {
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

                unimplemented!()
            }
            _ => buf.push(item),
        }
    }
}
