use swc_ecma_ast::{
    ClassMember, Expr, Function, MemberExpr, MemberProp, MethodKind, ParamOrTsParamProp,
    TsExprWithTypeArgs,
};
use swc_estree_ast::{
    ClassBody, ClassBodyEl, ClassImpl, ClassMethodKind, TSEntityName,
    TSExpressionWithTypeArguments, TSQualifiedName,
};

use super::Context;
use crate::swcify::{
    function::{swcify_function_params, SwcifiedFunctionParams},
    stmt::swcify_function_body,
    Swcify,
};

impl Swcify for ClassBody {
    type Output = Vec<ClassMember>;

    fn swcify(self, ctx: &Context) -> Self::Output {
        self.body.swcify(ctx)
    }
}

impl Swcify for ClassBodyEl {
    type Output = ClassMember;

    fn swcify(self, ctx: &Context) -> Self::Output {
        match self {
            ClassBodyEl::Method(v) => v.swcify(ctx),
            ClassBodyEl::PrivateMethod(v) => v.swcify(ctx).into(),
            ClassBodyEl::Prop(v) => v.swcify(ctx).into(),
            ClassBodyEl::PrivateProp(v) => v.swcify(ctx).into(),
            _ => {
                unimplemented!("swcify: {:?}", self)
            }
        }
    }
}

impl Swcify for swc_estree_ast::ClassMethod {
    type Output = swc_ecma_ast::ClassMember;

    fn swcify(self, ctx: &Context) -> Self::Output {
        match self.kind.unwrap_or(ClassMethodKind::Method) {
            ClassMethodKind::Get | ClassMethodKind::Set | ClassMethodKind::Method => {
                let SwcifiedFunctionParams { this_param, params } =
                    swcify_function_params(self.params, ctx);

                swc_ecma_ast::ClassMethod {
                    span: ctx.span(&self.base),
                    key: crate::swcify::expr::swcify_object_key(
                        self.key,
                        self.computed.unwrap_or_default(),
                        ctx,
                    ),
                    function: Function {
                        this_param,
                        params,
                        decorators: self.decorators.swcify(ctx).unwrap_or_default(),
                        span: ctx.span(&self.base),
                        body: Some(swcify_function_body(self.body, ctx)),
                        is_generator: self.generator.unwrap_or_default(),
                        is_async: self.is_async.unwrap_or_default(),
                        type_params: self.type_parameters.swcify(ctx).flatten().map(Box::new),
                        return_type: self.return_type.swcify(ctx).flatten().map(Box::new),
                        ..Default::default()
                    }
                    .into(),
                    kind: self
                        .kind
                        .map(|kind| match kind {
                            ClassMethodKind::Get => MethodKind::Getter,
                            ClassMethodKind::Set => MethodKind::Setter,
                            ClassMethodKind::Method => MethodKind::Method,
                            ClassMethodKind::Constructor => {
                                unreachable!()
                            }
                        })
                        .unwrap_or(MethodKind::Method),
                    is_static: self.is_static.unwrap_or_default(),
                    accessibility: self.accessibility.swcify(ctx),
                    is_abstract: self.is_abstract.unwrap_or_default(),
                    is_optional: self.optional.unwrap_or_default(),
                    is_override: false,
                }
                .into()
            }
            ClassMethodKind::Constructor => swc_ecma_ast::Constructor {
                span: ctx.span(&self.base),
                key: crate::swcify::expr::swcify_object_key(
                    self.key,
                    self.computed.unwrap_or_default(),
                    ctx,
                ),
                params: self
                    .params
                    .into_iter()
                    .map(|v| v.swcify(ctx))
                    .map(ParamOrTsParamProp::Param)
                    .collect(),
                body: Some(swcify_function_body(self.body, ctx)),
                accessibility: self.accessibility.swcify(ctx),
                is_optional: self.optional.unwrap_or_default(),
                ..Default::default()
            }
            .into(),
        }
    }
}

impl Swcify for swc_estree_ast::ClassPrivateMethod {
    type Output = swc_ecma_ast::PrivateMethod;

    fn swcify(self, ctx: &Context) -> Self::Output {
        let SwcifiedFunctionParams { this_param, params } =
            swcify_function_params(self.params, ctx);

        swc_ecma_ast::PrivateMethod {
            span: ctx.span(&self.base),
            key: self.key.swcify(ctx),
            function: Function {
                this_param,
                params,
                decorators: self.decorators.swcify(ctx).unwrap_or_default(),
                span: ctx.span(&self.base),
                body: Some(swcify_function_body(self.body, ctx)),
                is_generator: self.generator.unwrap_or_default(),
                is_async: self.is_async.unwrap_or_default(),
                type_params: self.type_parameters.swcify(ctx).flatten().map(Box::new),
                return_type: self.return_type.swcify(ctx).flatten().map(Box::new),
                ..Default::default()
            }
            .into(),
            kind: match self.kind.unwrap_or(ClassMethodKind::Method) {
                ClassMethodKind::Get => MethodKind::Getter,
                ClassMethodKind::Set => MethodKind::Setter,
                ClassMethodKind::Method => MethodKind::Method,
                ClassMethodKind::Constructor => {
                    unreachable!()
                }
            },
            is_static: self.is_static.unwrap_or_default(),
            accessibility: self.accessibility.swcify(ctx),
            is_abstract: self.is_abstract.unwrap_or_default(),
            is_optional: self.optional.unwrap_or_default(),
            is_override: false,
        }
    }
}

impl Swcify for swc_estree_ast::ClassProperty {
    type Output = swc_ecma_ast::ClassProp;

    fn swcify(self, ctx: &Context) -> Self::Output {
        let key = crate::swcify::expr::swcify_object_key(
            self.key,
            self.computed.unwrap_or_default(),
            ctx,
        );

        swc_ecma_ast::ClassProp {
            span: ctx.span(&self.base),
            key,
            value: self.value.swcify(ctx),
            type_ann: self.type_annotation.swcify(ctx).flatten().map(Box::new),
            is_static: self.is_static.unwrap_or(false),
            decorators: self.decorators.swcify(ctx).unwrap_or_default(),
            accessibility: self.accessibility.swcify(ctx),
            is_abstract: self.is_abstract.unwrap_or_default(),
            is_optional: self.optional.unwrap_or_default(),
            is_override: false,
            readonly: self.readonly.unwrap_or_default(),
            declare: self.declare.unwrap_or_default(),
            definite: self.definite.unwrap_or_default(),
        }
    }
}

impl Swcify for swc_estree_ast::ClassPrivateProperty {
    type Output = swc_ecma_ast::PrivateProp;

    fn swcify(self, ctx: &Context) -> Self::Output {
        swc_ecma_ast::PrivateProp {
            span: ctx.span(&self.base),
            key: self.key.swcify(ctx),
            value: self.value.swcify(ctx),
            type_ann: self.type_annotation.swcify(ctx).flatten().map(Box::new),
            is_static: self.static_any.as_bool().unwrap_or(false),
            decorators: Default::default(),
            accessibility: Default::default(),
            is_optional: false,
            is_override: false,
            readonly: false,
            definite: false,
            ctxt: Default::default(),
        }
    }
}

impl Swcify for ClassImpl {
    type Output = TsExprWithTypeArgs;

    fn swcify(self, ctx: &Context) -> Self::Output {
        match self {
            ClassImpl::TSExpr(v) => v.swcify(ctx),
            ClassImpl::Implements(_) => {
                unreachable!()
            }
        }
    }
}

impl Swcify for TSExpressionWithTypeArguments {
    type Output = TsExprWithTypeArgs;

    fn swcify(self, ctx: &Context) -> Self::Output {
        // The reason why we have special logic for converting `TSEntityName` here,
        // instead of updating or using logic of `TSEntityName`,
        // is that `TSEntityName` can be used somewhere,
        // if we change its conversion logic, it will break.
        fn swcify_expr(expr: TSEntityName, ctx: &Context) -> Box<Expr> {
            match expr {
                TSEntityName::Id(v) => v.swcify(ctx).into(),
                TSEntityName::Qualified(v) => swcify_qualified_name(v, ctx),
            }
        }
        fn swcify_qualified_name(qualified_name: TSQualifiedName, ctx: &Context) -> Box<Expr> {
            MemberExpr {
                obj: swcify_expr(*qualified_name.left, ctx),
                prop: MemberProp::Ident(qualified_name.right.swcify(ctx).into()),
                span: ctx.span(&qualified_name.base),
            }
            .into()
        }

        TsExprWithTypeArgs {
            span: ctx.span(&self.base),
            expr: swcify_expr(self.expression, ctx),
            type_args: self.type_parameters.swcify(ctx).map(Box::new),
        }
    }
}

#[cfg(test)]
mod tests {
    use swc_atoms::atom;
    use swc_common::{sync::Lrc, FileName, SourceMap};
    use swc_ecma_ast::{ClassMember, MethodKind};
    use swc_estree_ast as estree;
    use swc_node_comments::SwcComments;

    use crate::swcify::{Context, Swcify};

    fn base() -> estree::BaseNode {
        estree::BaseNode {
            leading_comments: Default::default(),
            inner_comments: Default::default(),
            trailing_comments: Default::default(),
            start: None,
            end: None,
            loc: None,
            range: None,
        }
    }

    #[test]
    fn test_swcify_class_method_kind_method() {
        let cm = Lrc::new(SourceMap::default());
        let fm = cm.new_source_file(Lrc::new(FileName::Anon), String::new());
        let comments = SwcComments::default();
        let ctx = Context::new_without_alloc(cm, comments, fm);

        let method = estree::ClassMethod {
            base: base(),
            kind: Some(estree::ClassMethodKind::Method),
            key: estree::ObjectKey::Id(estree::Identifier {
                base: base(),
                name: atom!("foo"),
                type_annotation: None,
                optional: None,
                decorators: None,
            }),
            params: vec![],
            body: estree::BlockStatement {
                base: base(),
                body: vec![],
                directives: vec![],
            },
            computed: None,
            is_static: None,
            generator: None,
            is_async: None,
            is_abstract: None,
            access: None,
            accessibility: None,
            decorators: None,
            optional: None,
            return_type: None,
            type_parameters: None,
        };

        let class_member: ClassMember = method.swcify(&ctx);
        match class_member {
            ClassMember::Method(m) => {
                assert_eq!(m.kind, MethodKind::Method);
            }
            _ => panic!("Expected ClassMember::Method"),
        }

        let private_method = estree::ClassBodyEl::PrivateMethod(estree::ClassPrivateMethod {
            base: base(),
            kind: Some(estree::ClassMethodKind::Method),
            key: estree::PrivateName {
                base: base(),
                id: estree::Identifier {
                    base: base(),
                    name: atom!("bar"),
                    type_annotation: None,
                    optional: None,
                    decorators: None,
                },
            },
            params: vec![],
            body: estree::BlockStatement {
                base: base(),
                body: vec![],
                directives: vec![],
            },
            is_static: None,
            generator: None,
            is_async: None,
            is_abstract: None,
            access: None,
            accessibility: None,
            decorators: None,
            optional: None,
            computed: None,
            return_type: None,
            type_parameters: None,
        });

        let private_member: ClassMember = private_method.swcify(&ctx);
        match private_member {
            ClassMember::PrivateMethod(m) => {
                assert_eq!(m.kind, MethodKind::Method);
            }
            _ => panic!("Expected ClassMember::PrivateMethod"),
        }
    }
}
