use swc_ecma_ast::{
    ClassMember, Expr, Function, MemberExpr, MemberProp, MethodKind, ParamOrTsParamProp,
    TsExprWithTypeArgs,
};
use swc_estree_ast::{
    ClassBody, ClassBodyEl, ClassImpl, ClassMethodKind, TSEntityName,
    TSExpressionWithTypeArguments, TSQualifiedName,
};

use super::Context;
use crate::swcify::Swcify;

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
                swc_ecma_ast::ClassMethod {
                    span: ctx.span(&self.base),
                    key: self.key.swcify(ctx),
                    function: Function {
                        params: self.params.swcify(ctx),
                        decorators: self.decorators.swcify(ctx).unwrap_or_default(),
                        span: ctx.span(&self.base),
                        body: Some(self.body.swcify(ctx)),
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
                            ClassMethodKind::Method => MethodKind::Getter,
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
                key: self.key.swcify(ctx),
                params: self
                    .params
                    .into_iter()
                    .map(|v| v.swcify(ctx))
                    .map(ParamOrTsParamProp::Param)
                    .collect(),
                body: Some(self.body.swcify(ctx)),
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
        swc_ecma_ast::PrivateMethod {
            span: ctx.span(&self.base),
            key: self.key.swcify(ctx),
            function: Function {
                params: self.params.swcify(ctx),
                decorators: self.decorators.swcify(ctx).unwrap_or_default(),
                span: ctx.span(&self.base),
                body: Some(self.body.swcify(ctx)),
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
                ClassMethodKind::Method => MethodKind::Getter,
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
        let key = self.key.swcify(ctx);

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
            is_static: false,
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
