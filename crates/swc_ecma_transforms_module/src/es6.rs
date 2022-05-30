use std::{cell::RefCell, rc::Rc as RustRc};

use serde::{Deserialize, Serialize};
use swc_common::{Mark, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::cross_transform_scope;
use swc_ecma_utils::{private_ident, quote_ident, ExprFactory};
use swc_ecma_visit::{noop_fold_type, Fold};

use super::util::{self};

pub fn es6(
    config: Config,
    unresolved_mark: Mark,
    cross_transform_scope: RustRc<RefCell<cross_transform_scope::Scope>>,
) -> impl Fold {
    Es6 {
        config,
        unresolved_mark,
        cross_transform_scope,
    }
}

struct Es6 {
    config: Config,
    unresolved_mark: Mark,
    cross_transform_scope: RustRc<RefCell<cross_transform_scope::Scope>>,
}

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(deny_unknown_fields, rename_all = "camelCase")]
pub struct Config {
    #[serde(default)]
    pub create_require: bool,

    #[serde(flatten, default)]
    pub config: util::Config,
}

impl Fold for Es6 {
    noop_fold_type!();

    fn fold_module_items(&mut self, mut items: Vec<ModuleItem>) -> Vec<ModuleItem> {
        println!("folding in es6 pass");
        if !self.config.create_require || !self.cross_transform_scope.borrow_mut().has_require_call
        {
            return items;
        }
        let mut stmts = Vec::with_capacity(items.len() + 2);

        /*
         * ```js
         * import {createRequire as _createRequire} from 'module';
         * const require = _createRequire(import.meta.url);
         * ```
         */
        let create_require_local = private_ident!("_createRequire");
        stmts.push(ModuleItem::ModuleDecl(ModuleDecl::Import(ImportDecl {
            span: DUMMY_SP,
            specifiers: vec![ImportSpecifier::Named(ImportNamedSpecifier {
                is_type_only: false,
                imported: Some(ModuleExportName::Ident(Ident::new(
                    "createRequire".into(),
                    DUMMY_SP,
                ))),
                local: create_require_local.clone(),
                span: DUMMY_SP,
            })],
            src: "module".into(),
            type_only: Default::default(),
            asserts: Default::default(),
        })));
        stmts.push(ModuleItem::Stmt(Stmt::Decl(Decl::Var(VarDecl {
            span: DUMMY_SP,
            kind: VarDeclKind::Const,
            declare: false,
            decls: vec![VarDeclarator {
                span: DUMMY_SP,
                name: quote_ident!(DUMMY_SP.apply_mark(self.unresolved_mark), "require").into(),
                init: Some(Box::new(Expr::Call(CallExpr {
                    callee: create_require_local.as_callee(),
                    args: vec![Expr::Member(MemberExpr {
                        obj: Box::new(
                            MemberExpr {
                                obj: Box::new(Ident::new("import".into(), DUMMY_SP).into()),
                                prop: MemberProp::Ident(Ident::new("meta".into(), DUMMY_SP)),
                                span: DUMMY_SP,
                            }
                            .into(),
                        ),
                        prop: Ident::new("url".into(), DUMMY_SP).into(),
                        span: DUMMY_SP,
                    })
                    .into()],
                    span: DUMMY_SP,
                    type_args: None,
                }))),
                definite: false,
            }],
        }))));
        stmts.append(&mut items);

        stmts
    }
}
