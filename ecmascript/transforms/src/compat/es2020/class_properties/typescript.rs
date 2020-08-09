use fxhash::FxHashMap;
use swc_atoms::JsWord;
use swc_common::{util::move_map::MoveMap, SyntaxContext};
use swc_ecma_ast::*;
use swc_ecma_visit::{Fold, FoldWith};

/// Legacy support.
////
/// # Side notes
///  - This should be applied before handling properties
///
///
/// # Why is this required?
///
/// Hygiene data of
///
///```ts
/// class A {
///     b = this.a;
///     constructor(a){
///         this.a = a;
///     }
/// }
/// ```
///
/// is
///
///```ts
/// class A0 {
///     constructor(a1){
///         this.a0 = a0;
///         this.b0 = this.a0;
///     }
/// }
/// ```
///
/// which is valid only for es2020 properties.
///
/// Legacy proposal which is used by typescript requires different hygiene.
#[derive(Debug, Default)]
pub(super) struct HygieneFixer {
    /// Hygiene information of properties extracted from constructor parameter.
    props: FxHashMap<JsWord, SyntaxContext>,
}

impl Fold for HygieneFixer {
    fn fold_class(&mut self, mut class: Class) -> Class {
        // Look for hygiene information.
        for member in &class.body {
            match member {
                ClassMember::Constructor(Constructor {
                    body: Some(..),
                    params,
                    ..
                }) => {
                    // Check if a parameter is property
                    for param in params {
                        match param {
                            ParamOrTsParamProp::TsParamProp(p) => match &p.param {
                                TsParamPropParam::Ident(p) => {
                                    self.props.insert(p.sym.clone(), p.span.ctxt);
                                }
                                TsParamPropParam::Assign(p) => match &*p.left {
                                    Pat::Ident(p) => {
                                        self.props.insert(p.sym.clone(), p.span.ctxt);
                                    }
                                    _ => {}
                                },
                            },
                            ParamOrTsParamProp::Param(p) => match &p.pat {
                                Pat::Ident(i) => {
                                    self.props.insert(i.sym.clone(), i.span.ctxt);
                                }
                                _ => {}
                            },
                        }
                    }
                }

                _ => {}
            }
        }

        // Modify hygiene information of properties.
        class.body = class.body.move_map(|member| match member {
            ClassMember::ClassProp(mut p) => {
                p.value = p.value.fold_with(&mut ValueFolder { props: &self.props });
                ClassMember::ClassProp(p)
            }
            _ => member,
        });

        class
    }
}

struct ValueFolder<'a> {
    props: &'a FxHashMap<JsWord, SyntaxContext>,
}

impl Fold for ValueFolder<'_> {
    fn fold_member_expr(&mut self, mut expr: MemberExpr) -> MemberExpr {
        expr = expr.fold_children_with(self);

        let obj = match expr.obj {
            ExprOrSuper::Super(_) => return expr,
            ExprOrSuper::Expr(e) => *e,
        };
        match obj {
            Expr::This(..) => {
                //
                match &mut *expr.prop {
                    Expr::Ident(i) => {
                        if let Some(ctxt) = self.props.get(&i.sym) {
                            i.span = i.span.with_ctxt(*ctxt);
                        }
                    }
                    _ => {}
                }
            }
            _ => {}
        }

        MemberExpr {
            obj: ExprOrSuper::Expr(Box::new(obj)),
            ..expr
        }
    }
}
