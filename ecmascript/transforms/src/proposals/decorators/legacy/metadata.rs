use swc_common::{util::move_map::MoveMap, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::ExprFactory;
use swc_ecma_visit::{Fold, FoldWith};

/// https://github.com/leonardfactory/babel-plugin-transform-typescript-metadata/blob/master/src/parameter/parameterVisitor.ts
pub(super) struct ParamMetadata;

impl Fold for ParamMetadata {
    fn fold_class(&mut self, mut cls: Class) -> Class {
        cls = cls.fold_children_with(self);
        let mut decorators = cls.decorators;

        cls.body = cls.body.move_map(|m| match m {
            ClassMember::Constructor(mut c) => {
                for (idx, param) in c.params.iter_mut().enumerate() {
                    //
                    match param {
                        ParamOrTsParamProp::TsParamProp(p) => {
                            for decorator in p.decorators.drain(..) {
                                let new_dec =
                                    self.create_param_decorator(idx, decorator.expr, true);
                                decorators.push(new_dec);
                            }
                        }
                        ParamOrTsParamProp::Param(param) => {
                            for decorator in param.decorators.drain(..) {
                                let new_dec =
                                    self.create_param_decorator(idx, decorator.expr, true);
                                decorators.push(new_dec);
                            }
                        }
                    }
                }

                ClassMember::Constructor(c)
            }
            _ => m,
        });
        cls.decorators = decorators;

        cls
    }

    fn fold_class_method(&mut self, mut m: ClassMethod) -> ClassMethod {
        for (idx, param) in m.function.params.iter_mut().enumerate() {
            for decorator in param.decorators.drain(..) {
                let new_dec = self.create_param_decorator(idx, decorator.expr, false);
                m.function.decorators.push(new_dec);
            }
        }

        m
    }
}

impl ParamMetadata {
    fn create_param_decorator(
        &self,
        param_index: usize,
        decorator_expr: Box<Expr>,
        is_constructor: bool,
    ) -> Decorator {
        Decorator {
            span: DUMMY_SP,
            expr: Box::new(Expr::Fn(FnExpr {
                ident: None,
                function: Function {
                    params: vec![
                        Param {
                            span: DUMMY_SP,
                            decorators: Default::default(),
                            pat: Pat::Ident(quote_ident!("target")),
                        },
                        Param {
                            span: DUMMY_SP,
                            decorators: Default::default(),
                            pat: Pat::Ident(quote_ident!("target")),
                        },
                    ],
                    body: Some(BlockStmt {
                        span: DUMMY_SP,
                        stmts: vec![Stmt::Return(ReturnStmt {
                            span: DUMMY_SP,
                            arg: Some(Box::new(Expr::Call(CallExpr {
                                span: DUMMY_SP,
                                callee: decorator_expr.as_callee(),
                                args: vec![
                                    quote_ident!("target").as_arg(),
                                    if is_constructor {
                                        quote_ident!("undefined").as_arg()
                                    } else {
                                        quote_ident!("key").as_arg()
                                    },
                                    Lit::Num(Number {
                                        span: DUMMY_SP,
                                        value: param_index as _,
                                    })
                                    .as_arg(),
                                ],
                                type_args: Default::default(),
                            }))),
                        })],
                    }),
                    decorators: Default::default(),
                    span: Default::default(),
                    is_generator: Default::default(),
                    is_async: Default::default(),
                    type_params: Default::default(),
                    return_type: Default::default(),
                },
            })),
        }
    }
}

/// https://github.com/leonardfactory/babel-plugin-transform-typescript-metadata/blob/master/src/metadata/metadataVisitor.ts
pub(super) struct Metadata;

impl Fold for Metadata {
    fn fold_class(&mut self, mut c: Class) -> Class {
        c = c.fold_children_with(self);

        if c.decorators.is_empty() {
            return c;
        }

        let constructor = c.body.iter().find_map(|m| match m {
            ClassMember::Constructor(c) => Some(c),
            _ => None,
        });
        if constructor.is_none() {
            return c;
        }

        {
            let dec = self
                .create_metadata_design_decorator("design:type", quote_ident!("Function").as_arg());
            c.decorators.push(dec);
        }
        {
            let dec = self.create_metadata_design_decorator(
                "design:paramtypes",
                ArrayLit {
                    span: DUMMY_SP,
                    elems: constructor
                        .as_ref()
                        .unwrap()
                        .params
                        .iter()
                        .map(|v| match v {
                            ParamOrTsParamProp::TsParamProp(p) => Some(serialize_type().as_arg()),
                            ParamOrTsParamProp::Param(p) => Some(serialize_type().as_arg()),
                        })
                        .collect(),
                }
                .as_arg(),
            );
            c.decorators.push(dec);
        }
        c
    }

    fn fold_class_method(&mut self, mut m: ClassMethod) -> ClassMethod {
        if m.function.decorators.is_empty() {
            return m;
        }

        {
            let dec = self
                .create_metadata_design_decorator("design:type", quote_ident!("Function").as_arg());
            m.function.decorators.push(dec);
        }
        {
            let dec = self.create_metadata_design_decorator(
                "design:paramtypes",
                ArrayLit {
                    span: DUMMY_SP,
                    elems: m
                        .function
                        .params
                        .iter()
                        .map(|v| Some(serialize_type().as_arg()))
                        .collect(),
                }
                .as_arg(),
            );
            m.function.decorators.push(dec);
        }
        m
    }

    fn fold_class_prop(&mut self, mut p: ClassProp) -> ClassProp {
        if p.decorators.is_empty() {
            return p;
        }

        if p.type_ann.is_none() {
            return p;
        }

        let dec = self.create_metadata_design_decorator(
            "design:type",
            serialize_type(classPath, field).as_arg(),
        );

        p
    }
}

impl Metadata {
    fn create_metadata_design_decorator(&self, design: &str, type_arg: ExprOrSpread) -> Decorator {
        Decorator {
            span: DUMMY_SP,
            expr: Box::new(Expr::Call(CallExpr {
                span: DUMMY_SP,
                callee: member_expr!(DUMMY_SP, Reflect.metadata).as_callee(),
                args: vec![
                    Str {
                        span: DUMMY_SP,
                        value: design.into(),
                        has_escape: false,
                    }
                    .as_arg(),
                    type_arg,
                ],

                type_args: Default::default(),
            })),
        }
    }
}

fn serialize_type() -> Expr {}
